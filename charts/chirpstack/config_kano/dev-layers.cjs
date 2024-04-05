module.exports = [
  {
    name: 'Layers.OSM',
    description: 'Layers.OSM_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          OSM: 'OSM',
          OSM_DESCRIPTION: 'Données OpenStreetMap'
        }
      },
      en: {
        Layers: {
          OSM: 'OSM',
          OSM_DESCRIPTION: 'OpenStreeMap data'
        }
      }
    },
    tags: [
      'street'
    ],
    iconUrl: `http://a.tile.osm.org/0/0/0.png`,
    icon: 'streetview',
    attribution: 'OpenStreetMap © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      isVisible: true,
      source: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      maxZoom: 21,
      maxNativeZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      url: `http://a.tile.osm.org`
    }
  },
  {
    name: 'Layers.PLAN_IGN',
    description: 'Layers.PLAN_IGN_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          PLAN_IGN: 'Plan IGN',
          PLAN_IGN_DESCRIPTION: 'Plan IGN v2'
        }
      },
      en: {
        Layers: {
          PLAN_IGN: 'Plan IGN',
          PLAN_IGN_DESCRIPTION: 'Plan IGN v2'
        }
      }
    },
    tags: [
      'street'
    ],
    type: 'BaseLayer',
    iconUrl: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX=8&TILEROW=92&TILECOL=132',
    icon: 'las la-plug',
    attribution: '<a href="https://www.ign.fr/">IGN</a>',
    cesium: {
      type: 'WebMapTileService',
      url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}',
      format: 'image/png',
      layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
      style: 'normal',
      tileMatrixSetID: 'PM'
    },
    leaflet: {
      type: 'tileLayer',
      source: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    }
  },
  {
    name: 'Layers.CHIRPSTACK_BATTERY',
    description: 'Layers.CHIRPSTACK_BATTERY_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          CHIRPSTACK_BATTERY: 'batterie LoRaWAN',
          CHIRPSTACK_BATTERY_DESCRIPTION: 'Capteurs LORAWAN du démonstrateur Kalisio, infos communes'
        },
        Variables: {
          LORAWAN_SENSORS_LABEL:'capteurs de mesures LoRaWAN',
          BATTERY_LEVEL_LABEL: 'Taux de charge batterie'
        }        
      },
      en: {
        Layers: {
          CHIRPSTACK_BATTERY: 'batterie LoRaWAN',
          CHIRPSTACK_BATTERY_DESCRIPTION: 'LoRaWAN sensors of the demonstrator, common values'
        },    
        Variables: {
          LORAWAN_SENSORS_LABEL:'LoRaWAN sensors values',
          BATTERY_LEVEL_LABEL: 'Batterie level'
        }    
      }
    },
    tags: ['sensors'],
    type: 'OverlayLayer',
    service: 'chirpstack-observations',
    probeService: 'chirpstack-stations',
    ttl: 7 * 24 * 60 * 60,
    featureId: 'gw_euid',
    featureLabel: 'Variables.LORAWAN_SENSORS_LABEL',
    from: 'P-0D',
    to: 'PT-5D',
    every: 'PT1H',
    queryFrom: 'PT-5M',
    variables: [
      {
        name: 'battery',
        label: 'Variables.BATTERY_LEVEL_LABEL',
        unit: ['%'],
        range: [0, 100],
        step: 5,
        chartjs: {
          backgroundColor: 'rgba(1, 10, 1, 128)',
          borderColor: 'rgb(1, 10, 1)',
          fill: false
        }
      }
    ],
    leaflet: {
      type: 'geoJson',
      realtime: true,
      tiled: true,
      cluster: { disableClusteringAtZoom: 18 },
      'marker-color': `<% if (properties.status === 'OK') { %>green<% }
                          else { %>red<% } %>`,
      'icon-classes': 'fa fa-wifi',
      'icon-x-offset': -2,
      'icon-color': '#FFF',
      template: ['marker-color'],
      tooltip: {
        template: 'Gateway: <%= properties.euid %>'
      }
    }
  },
  {
    name: 'Layers.CHIRPSTACK_TEMPERATURE',
    description: 'Layers.CHIRPSTACK_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          CHIRPSTACK_TEMPERATURE: 'Température',
          CHIRPSTACK_DESCRIPTION: 'Température des capteurs LORAWAN'
        },
        Variables: {         
          LORAWAN_SENSORS_LABEL:'capteurs de mesures LoRaWAN',
          TEMPERATURE_LABEL: 'Température',          
        }        
      },
      en: {
        Layers: {
          CHIRPSTACK_TEMPERATURE: 'Temperature',
          CHIRPSTACK_DESCRIPTION: 'Temperature of LORAWAN sensors'
        },    
        Variables: {
          LORAWAN_SENSORS_LABEL:'LoRaWAN sensors values',
          TEMPERATURE_LABEL: 'Temperature'
        }    
      }
    },
    tags: ['sensors'],
    type: 'OverlayLayer',
    service: 'chirpstack-observations',
    probeService: 'chirpstack-stations',
    ttl: 7 * 24 * 60 * 60,
    featureId: 'gw_euid',
    featureLabel: 'Variables.LORAWAN_SENSORS_LABEL',
    from: 'P-0D',
    to: 'PT-5D',
    every: 'PT1H',
    queryFrom: 'PT-5M',
    variables: [
      {
        name: 'temperature',
        label: 'Variables.TEMPERATURE_LABEL',
        unit: ['degC'],
        range: [-50, 127],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(255, 99, 132, 128)',
          borderColor: 'rgb(255, 99, 132)',
          fill: false
        }
      }
    ],
    leaflet: {
      type: 'geoJson',
      realtime: true,
      tiled: true,
      cluster: { disableClusteringAtZoom: 18 },
      'marker-color': `<% if (properties.status === 'OK') { %>green<% }
                          else { %>red<% } %>`,
      'icon-classes': 'fa fa-wifi',
      'icon-x-offset': -2,
      'icon-color': '#FFF',
      template: ['marker-color'],
      tooltip: {
        template: 'Gateway: <%= properties.euid %>'
      }
    }
  },
  ,
  {
    name: 'Layers.CHIRPSTACK_SOUND',
    description: 'Layers.CHIRPSTACK_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          CHIRPSTACK_SOUND: 'Niveau de son',
          CHIRPSTACK_DESCRIPTION: 'Capteurs de son du réseau LORAWAN'
        },
        Variables: {
          LORAWAN_SENSORS_LABEL:'capteurs de mesures LoRaWAN',
          LAEQ: 'Niveau de pression acoustique continue',
          LAF: 'Niveau sonore avec Pondération Fréquentielle',
          LAFMAX: 'Niveau Sonore Maximal avec Pondération Fréquentielle '       
        }        
      },
      en: {
        Layers: {          
          CHIRPSTACK_SOUND: 'Sound level',
          CHIRPSTACK_DESCRIPTION: 'LoRaWAN sound sensors'
        },    
        Variables: {
          LORAWAN_SENSORS_LABEL:'LoRaWAN sensors values',
          LAEQ: 'Sound level A-weighted equivalent',
          LAF: 'Sound level A-weighted',
          LAFMAX: 'Sound level A-weighted fast maximum'   
        }    
      }
    },
    tags: ['sensors'],
    type: 'OverlayLayer',
    service: 'chirpstack-observations',
    probeService: 'chirpstack-stations',
    ttl: 7 * 24 * 60 * 60,
    featureId: 'gw_euid',
    featureLabel: 'Variables.LORAWAN_SENSORS_LABEL',
    from: 'P-0D',
    to: 'PT-5D',
    every: 'PT1H',
    queryFrom: 'PT-5M',
    variables: [
      {
        name: 'lamax',
        label: 'Variables.LAFMAX',
        unit: ['dbA'],
        range: [0, 160],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(79, 56, 0, 128)',
          borderColor: 'rgb(79, 56, 0)',
          fill: false
        }
      },
      {
        name: 'laeq',
        label: 'Variables.LAEQ',
        unit: ['dbA'],
        range: [0, 160],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(79, 14, 0, 128)',
          borderColor: 'rgb(79, 14, 0)',
          fill: false
        }
      },
      {
        name: 'la',
        label: 'Variables.LAF',
        unit: ['dbA'],
        range: [0, 160],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(79, 0, 35, 128)',
          borderColor: 'rgb(79, 0, 35)',
          fill: false
        }
      }
    ],
    leaflet: {
      type: 'geoJson',
      realtime: true,
      tiled: true,
      cluster: { disableClusteringAtZoom: 18 },
      'marker-color': `<% if (properties.status === 'OK') { %>green<% }
                          else { %>red<% } %>`,
      'icon-classes': 'fa fa-wifi',
      'icon-x-offset': -2,
      'icon-color': '#FFF',
      template: ['marker-color'],
      tooltip: {
        template: 'Sensor: <%= properties.euid %>'
      }
    }
  }
]


