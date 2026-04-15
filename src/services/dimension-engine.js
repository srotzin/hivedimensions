'use strict';const{v4:uuid}=require('uuid');const grids=new Map();const operations=new Map();
let stats={grids_created:0,x_operations:0,y_operations:0,z_operations:0,total_agents_coordinated:0};

function createGrid(opts={}){const id=uuid();const g={id,name:opts.name||`grid-${id.slice(0,8)}`,agents:opts.agents||[],x_axis:{label:'Parallel',workers:opts.x_workers||[]},y_axis:{label:'Pipeline',stages:opts.y_stages||[]},z_axis:{label:'Convergence',domains:opts.z_domains||[]},created_at:new Date().toISOString(),status:'active'};grids.set(id,g);stats.grids_created++;stats.total_agents_coordinated+=g.agents.length;return g}

function executeX(gridId,task){const g=grids.get(gridId);if(!g)return null;const id=uuid();const op={id,grid_id:gridId,axis:'x',type:'parallel',task,workers:g.x_axis.workers.length||g.agents.length,fan_out:true,created_at:new Date().toISOString(),status:'executing'};operations.set(id,op);stats.x_operations++;return op}

function executeY(gridId,stages){const g=grids.get(gridId);if(!g)return null;const id=uuid();const op={id,grid_id:gridId,axis:'y',type:'pipeline',stages:stages||g.y_axis.stages,current_stage:0,created_at:new Date().toISOString(),status:'executing'};operations.set(id,op);stats.y_operations++;return op}

function executeZ(gridId,domains){const g=grids.get(gridId);if(!g)return null;const id=uuid();const op={id,grid_id:gridId,axis:'z',type:'convergence',domains:domains||g.z_axis.domains,convergence_point:null,created_at:new Date().toISOString(),status:'converging'};operations.set(id,op);stats.z_operations++;return op}

function getStats(){return{...stats,active_grids:[...grids.values()].filter(g=>g.status==='active').length,running_operations:[...operations.values()].filter(o=>o.status==='executing'||o.status==='converging').length}}
function listGrids(){return[...grids.values()]}
function listOps(){return[...operations.values()]}
module.exports={createGrid,executeX,executeY,executeZ,getStats,listGrids,listOps};
