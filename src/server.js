'use strict';const express=require('express');const cors=require('cors');const app=express();const PORT=process.env.PORT||3016;
app.use(cors());app.use(express.json());app.use('/',require('./routes/health'));app.use('/',require('./routes/dimensions'));app.use('/',require('./routes/ai'));
app.get('/',(_,r)=>r.json({service:'hivedimensions',version:'1.0.0',description:'Multi-axis coordination — X (parallel), Y (pipeline), Z (convergence)',endpoints:{grid:'POST /v1/dimensions/grid',x:'POST /v1/dimensions/x/:gridId',y:'POST /v1/dimensions/y/:gridId',z:'POST /v1/dimensions/z/:gridId',stats:'GET /v1/dimensions/stats',grids:'GET /v1/dimensions/grids',operations:'GET /v1/dimensions/operations',health:'GET /health'}}));
const hc=require('./services/hive-client');

app.get('/.well-known/agent-card.json', (req, res) => res.json({
  protocolVersion: '0.3.0',
  name: 'hivedimensions',
  description: "HiveDimensions — multi-axis valuation surface for agent assets.",
  url: 'https://hivedimensions.onrender.com',
  version: '1.0.0',
  provider: { organization: 'Hive Civilization', url: 'https://hiveagentiq.com' },
  capabilities: { streaming: false, pushNotifications: false },
  defaultInputModes: ['application/json'],
  defaultOutputModes: ['application/json'],
  authentication: { schemes: ['x402', 'api-key'] },
  payment: {
    protocol: 'x402', currency: 'USDC', network: 'base',
    address: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e'
  },
  extensions: {
    hive_pricing: {
      currency: 'USDC', network: 'base', model: 'per_call',
      first_call_free: true, loyalty_threshold: 6,
      loyalty_message: 'Every 6th paid call is free'
    }
  },
  bogo: {
    first_call_free: true, loyalty_threshold: 6,
    pitch: "Pay this once, your 6th paid call is on the house. New here? Add header 'x-hive-did' to claim your first call free.",
    claim_with: 'x-hive-did header'
  }
}));

app.get('/.well-known/ap2.json', (req, res) => res.json({
  ap2_version: '1.0',
  agent: 'hivedimensions',
  payment_methods: ['x402-usdc-base'],
  treasury: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
  bogo: { first_call_free: true, loyalty_threshold: 6, claim_with: 'x-hive-did header' }
}));

// ─── A2A Discovery ───────────────────────────────────────────────────────────
app.get('/.well-known/agent.json', (req, res) => {
  res.json({
    schemaVersion: '1.0',
    name: 'hivedimensions',
    description: 'Hive Dimensions — multi-axis agent capability measurement',
    version: '1.0.0',
    url: 'https://hivedimensions.onrender.com',
    payment: {
      scheme: 'x402', protocol: 'x402', network: 'base',
      currency: 'USDC', asset: 'USDC',
      address:   '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
      recipient: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
      treasury:  'Monroe (W1)',
      rails: [
        {chain:'base',     asset:'USDC', address:'0x15184bf50b3d3f52b60434f8942b7d52f2eb436e'},
        {chain:'base',     asset:'USDT', address:'0x15184bf50b3d3f52b60434f8942b7d52f2eb436e'},
        {chain:'ethereum', asset:'USDT', address:'0x15184bf50b3d3f52b60434f8942b7d52f2eb436e'},
        {chain:'solana',   asset:'USDC', address:'B1N61cuL35fhskWz5dw8XqDyP6LWi3ZWmq8CNA9L3FVn'},
        {chain:'solana',   asset:'USDT', address:'B1N61cuL35fhskWz5dw8XqDyP6LWi3ZWmq8CNA9L3FVn'},
      ],
    },
    extensions: {
      hive_pricing: {
        currency: 'USDC', network: 'base', model: 'per_call',
        first_call_free: true, loyalty_threshold: 6,
        loyalty_message: 'Every 6th paid call is free',
        treasury: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
        treasury_codename: 'Monroe (W1)',
      },
    },
    bogo: {
      first_call_free: true, loyalty_threshold: 6,
      pitch: "Pay this once, your 6th paid call is on the house. New here? Add header 'x-hive-did' to claim your first call free.",
      claim_with: 'x-hive-did header',
    },
  });
});

app.listen(PORT,async()=>{console.log(`[hivedimensions] Listening on port ${PORT}`);try{await hc.registerWithHiveTrust()}catch(e){}try{await hc.registerWithHiveGate()}catch(e){}});
module.exports=app;
