# helm chart for chirpstack

This is a helm package for chirpstack.
The chart: 
  * contains components of the [chirpstack](https://www.chirpstack.io/) project: the gateway bridge, the network server, an **optionnally** the rest API
  * contains [mosquitto](https://mosquitto.org/), a MQTT broker used by Chirpstack
  * contains the micro service to transform UpLink events to geojson, aka chirstack mongodb integration (cf [doc](https://github.com/romainjacquet/chirpstack-mongodb-integration))
  * has no dependency  
  * provide a default configuration in the config folder, for two regions eu868 and in865.
  
As there is no dependencies it need that you must be installed helm charts of the dependencies before.

| Dependency | Usage                                        | Possible chart     | Required |
|------------|----------------------------------------------|--------------------|----------|
| PostGreSQL | Use by Chirpstack and keycloak               | bitnami/postgresql | Yes      |
| Redis      | Used by Chirpstack                           | bitnami/redis      | Yes      |
| MongoDB    | Used by the Chirpstack mongoDB integration   | bitnami/mongodb    | Yes      |
| Keycloak   | Used by Chirpstack to provide authentication | bitnami/keycloak   | No       |

> [!WARNING]
> This project is currently under development.

## TL;TR

```console
helm install my-release oci://harbor.portal.kalisio.com/kalisio/helm/chirpstack
```

There is a lot of configuration to provide to connect the different component. There is also optionnal configuration.
Check the default values with this command:
```console
helm show values oci://harbor.portal.kalisio.com/kalisio/helm/chirpstack
```

## development

To build a local archive of the chart:
```console
helm package charts/chirpstack
```

## limitations and warnings

  * it is currently mandatory to install the micro service to write in MongoDB. Future versions may separate it
  * the gateway bridge of chirpstack is exposing UDP service. It's not manage in the ingress, because configuration
  depends on your cloud provider. 

## context

This chart has been written to display LoraWAN data in [Kano](https://github.com/kalisio/kano), a data explorer in 2D/3D.
Data management is done with [Chirpstack](https://www.chirpstack.io/), a popular LoraWAN network server.

![Chirpstack](/pictures/chirpstack-temperature.png)

This is part of R&D of Kalisio.
