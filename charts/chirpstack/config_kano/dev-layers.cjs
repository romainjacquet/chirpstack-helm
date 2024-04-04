module.exports = [{
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
    name: 'Layers.CHIRPSTACK',
    description: 'Layers.CHIRPSTACK_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          CHIRPSTACK: 'LoRaWAN',
          CHIRPSTACK_DESCRIPTION: 'Capteurs LORAWAN du démonstrateur Kalisio'
        }
      },
      en: {
        Layers: {
          CHIRPSTACK: 'LoRaWAN',
          CHIRPSTACK_DESCRIPTION: 'LoRaWAN sensors of the demonstrator'
        }
      }
    },
    tags: ['sensors'],
    type: 'OverlayLayer',
    service: 'chirpstack-observations',
    probeService: 'chirpstack-stations',
    ttl: 7 * 24 * 60 * 60,
    featureId: 'euid',
    featureLabel: 'name',
    from: 'P-0D',
    to: 'PT-5D',
    every: 'PT1H',
    queryFrom: 'PT-5M',
    variables: [
      {
        name: 'temperature',
        label: 'sensor_values.temperature',
        units: ['degC'],
        range: [-50, 127],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(255, 99, 132, 128)',
          borderColor: 'rgb(255, 99, 132)',
          fill: false
        }
      },
      {
        name: 'humidity',
        label: 'sensor_values.humidity',
        units: ['%'],
        range: [0, 100],
        step: 5,
        chartjs: {
          backgroundColor: 'rgba(255, 88, 52, 128)',
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
        template: '<%= properties.name %>: <%= properties.temperature %>°C'
      }
    }
  }
]


