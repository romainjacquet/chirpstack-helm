# chirpstack-helm

Experimenting Chirpstack deployment to Kubernetes. The goal is testing a private LoraWan network for smart agriculture, smart industries or smart cityes.
This private network will allow all the participants to share data, and view on a map.

The region support is limited to Chirstack region used in Europe:

  * EU868     
  * IN865 
  * CN470 (soonly)
  * US915 (soonly)

> [!WARNING]
> This project is currently under development.

## basic installation guide

### with Helmfile

Build and deploy with helmfile the **recommanded** method.
```shell
helmfile apply -e minikube .
```
Uninstall:
```shell
helmfile destroy .
```

### with helm

Build and deploy with helm. This is **not the recommanded** method.

```shell
helm dependency build charts/chirpstack
helm package charts/chirpstack
helm install -f helmfileconfig/minikube/redis.yaml redis-bitnami oci://registry-1.docker.io/bitnamicharts/redis
helm install -f helmfileconfig/minikube/postgres.yaml postgres-bitnami oci://registry-1.docker.io/bitnamicharts/postgresql
helm install -f helmfileconfig/minikube/chirpstack.yaml sad-bamboo ./chirpstack-0.0.1.tgz
```

Uninstall with helm:
```shell
helm uninstall sab-bamboo
helm uninstall redis-bitnami
helm uninstall redis-bitnami 
```

### basic usage

Connect to the network server on minikube:
```shell
minikube service chirpstack --url -n chirpstack-dev
```

## Architecture

The choosen infrastructure has one MQTT broker per region. The advantages are:

  * better scalability: avoid that one MQTT broker support traffic coming from all the regions)
  * easyier configuration on the gateway: no need to add a prefix in the topic

![Chripstack](/schemas/infra-structure.png)

The external services are :

  * the web portal for the network server Chirpstack (port 80)
  * MQTT forwarder port 1883
  * UDP semtech port 1700
  * basic station 3001 (to be confirmed)

### Kubernetes infrastructure

![Chripstack](/schemas/kubernetes.png)

## Use cases 

  * adding a new user, i.e. new gateway in a region 
  * deleting a user

## Tests

Tests should be done both with software (simulators) and hardare.
Type of devices to test ?

### Hardware tests

We need at least a gateway and typical sensors for smart agriculture. Money can be saved by buying just a temperature sensor.

  * [a GW for 200€](https://sparwan.com/smart-office-/115-passerelle-lorawan-ug63-868m-6974225038176.html), support all the connexion we need: MQTT, Semtech, BS
  * [a weather station 300€](https://sparwan.com/stations-meteo/642-station-meteo-lorawan-8-en-1-sensecap-s2120-seeedstudio.html)
  * [a soil humidity captor, 200€](https://sparwan.com/smart-agriculture-/495-capteur-d-humidite-du-sol-lorawan-rak-wireless-c15007.html)
  * [a simple temperature sensor](https://sparwan.com/qualite-de-l-air/599-capteur-de-temperature-lorawan-milesight-ts302.html)

### Software tests


There is still open points on this section (test capabilities, payload data,)

  * [lora-pktgen](https://github.com/donadonny/lora-pktgen) : support only semtech (UDP packet) 
  * [LWN-simulator](https://github.com/UniCT-ARSLab/LWN-Simulator) : more complete system

## Roadmap

The project is currently a testbed. Below are a list of the future steps:

  - [ ] testing with a hardware gateway  
  - [ ] include an integration to mongoDB
  - [ ] integrate the Kalisio maps to view data
  - [ ] protect all service with a Keycloak webportal
