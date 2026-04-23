'use strict';const express=require('express');const cors=require('cors');const app=express();const PORT=process.env.PORT||3016;
app.use(cors());app.use(express.json());app.use('/',require('./routes/health'));app.use('/',require('./routes/dimensions'));app.use('/',require('./routes/ai'));
app.get('/',(_,r)=>r.json({service:'hivedimensions',version:'1.0.0',description:'Multi-axis coordination — X (parallel), Y (pipeline), Z (convergence)',endpoints:{grid:'POST /v1/dimensions/grid',x:'POST /v1/dimensions/x/:gridId',y:'POST /v1/dimensions/y/:gridId',z:'POST /v1/dimensions/z/:gridId',stats:'GET /v1/dimensions/stats',grids:'GET /v1/dimensions/grids',operations:'GET /v1/dimensions/operations',health:'GET /health'}}));
const hc=require('./services/hive-client');
app.listen(PORT,async()=>{console.log(`[hivedimensions] Listening on port ${PORT}`);try{await hc.registerWithHiveTrust()}catch(e){}try{await hc.registerWithHiveGate()}catch(e){}});
module.exports=app;
