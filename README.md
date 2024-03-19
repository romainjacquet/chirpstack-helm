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
The default installation download all the devices from the internet. It's possible to skip this step:
```shell
helm install -f helmfileconfig/minikube/chirpstack.yaml  --set env.fetch_lorawan_device=False  sad-bamboo ./chirpstack-0.0.1.tgz
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

This section describes how to connect hardware (gateway and sensors) to chirpstack. This part require the installation
of a kubectl plugin, because kubectl cannot natively managed UDP port with kubectl port-forward (see issue #47862)[https://github.com/kubernetes/kubernetes/issues/47862].

The following hardware have been used:

  * Gateway [Milesight UG63](https://www.milesight.com/iot/product/lorawan-gateway/ug63), the gateway support different packet forwared: MQTT, Semtech UDP, basicstation.
>  [!WARNING] 
>  MQTT packet forwarder required chirpstack V3
>  if you are using chirpstack V4 the connexion must be done with semtech UDP Protocol
  * Environment sensor [Milesight EM300-TH-868M](https://www.milesight.com/iot/product/lorawan-sensor/em300-th)
  * Sound level sensor [Milesight WS302-868M](https://www.milesight.com/iot/product/lorawan-sensor/ws302)

Connect minikube to the Lorawan gateway:

  1. Configure the gateway using the webinterface: add packet forwarder with type Semtech, keep the port 1700
  2. Install the kubectl plugin manager [krew](https://krew.sigs.k8s.io/)
  3. Install the kubectl plugin [relay](https://github.com/knight42/krelay?tab=readme-ov-file#installation)
  4. Configure the port redirection `kubectl relay --address 0.0.0.0  service/chirpstack-gateway-bridge  1700:1700@udp`
  5. Check that chirpstack received event from Mosquitto `kubectl logs service/chirpstack-gateway-bridge -f |grep uplink`

Configure the Chirpstack network server:

  1. Go the `Tenant > Gateways > Add gateway`
  2. The gateway ID is available in the milesight web interface. Fill the form and submit 
  3. Go the `Tenant > Gateways > Your_gateway`, after few minutes the GW shoud be seen
  4. You can check this step by looking at the `LoRaWAN` tab in `Tenant > Gateways > Your_gateway`

Adding the sensors in Chirpstack. It will begin by creating an application and a device profile:

  1. Go to `Tenant > Applications` , click on `Add application`. Fill the form and submit
  2. Go to `Tenant > Devices Profiles`, create a profile for your sensor. Example classA_eu868.
  3. Go to `Tenant > Applications > Your application`, click on `Add device`
    1. The device EUI could be find on the the device
    2. it's not required to add Join EUI
    3. Select your device profile
    4. It's recommanded to keep OTAA authentication
    5. you will have to provide the Application key, usually device with a default value

### Software tests


There is still open points on this section (test capabilities, payload data,)

  * [lora-pktgen](https://github.com/donadonny/lora-pktgen) : support only semtech (UDP packet) 
  * [LWN-simulator](https://github.com/UniCT-ARSLab/LWN-Simulator) : more complete system

## Roadmap

The project is currently a testbed. Below are a list of the future steps:

  - [ X ] testing with a hardware gateway  
  - [ ] include an integration to mongoDB
  - [ ] integrate the Kalisio maps to view data
  - [ ] protect all service with a Keycloak webportal
