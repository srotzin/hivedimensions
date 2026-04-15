'use strict';const{Router}=require('express');const e=require('../services/dimension-engine');const r=Router();
r.post('/v1/dimensions/grid',(q,s)=>{s.status(201).json({status:'grid_created',grid:e.createGrid(q.body)})});
r.post('/v1/dimensions/x/:gridId',(q,s)=>{const op=e.executeX(q.params.gridId,q.body.task);if(!op)return s.status(404).json({error:'Grid not found'});s.json({status:'parallel_executing',operation:op})});
r.post('/v1/dimensions/y/:gridId',(q,s)=>{const op=e.executeY(q.params.gridId,q.body.stages);if(!op)return s.status(404).json({error:'Grid not found'});s.json({status:'pipeline_executing',operation:op})});
r.post('/v1/dimensions/z/:gridId',(q,s)=>{const op=e.executeZ(q.params.gridId,q.body.domains);if(!op)return s.status(404).json({error:'Grid not found'});s.json({status:'converging',operation:op})});
r.get('/v1/dimensions/stats',(_,s)=>s.json(e.getStats()));
r.get('/v1/dimensions/grids',(_,s)=>s.json({grids:e.listGrids()}));
r.get('/v1/dimensions/operations',(_,s)=>s.json({operations:e.listOps()}));
module.exports=r;
