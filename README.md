# chirpstack-helm

Experimenting Chirpstack deployment to Kubernetes. The goal is testing a private LoraWan network for smart agriculture, smart industries or smart cities.
This private network will allow all the participants to share data, and view on a map.

The chart: 
  * contains mosquitto (MQTT broker), the gateway bridge, the network server and the rest API.
  * has no dependency
  * does not include the dependencies redis and postgres. See the helmfile, to view how to use chart for this
  * provide a default configuration in the config folder, for two regions eu868 and in865.
  

> [!WARNING]
> This project is currently under development.


## basic installation guide

Some docker images need for chirpstack are host on `harbor.portal.kalisio.com`. So you will have to login with `docker login`
command to this host, and after create a kubectl secret based on this.

```shell
docker login harbor.portal.kalisio.com
kubectl create secret generic kalisio-harbor  \
  --from-file=.dockerconfigjson=/home/rjacquet31/.docker/config.json \
  --type=kubernetes.io/dockerconfigjson
```

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

Build and deploy with helm. This is **not the recommanded** method but it can help in development phases.

```shell
helm dependency build charts/chirpstack
helm package charts/chirpstack
helm install -f helmfileconfig/minikube/redis.yaml redis oci://registry-1.docker.io/bitnamicharts/redis
helm install -f helmfileconfig/minikube/postgres.yaml postgres oci://registry-1.docker.io/bitnamicharts/postgresql
helm install -f helmfileconfig/minikube/mongodb.yaml mongodb  oci://registry-1.docker.io/bitnamicharts/mongodb
helm install -f helmfileconfig/minikube/chirpstack.yaml chirpstack ./chirpstack-0.0.1.tgz
helm install -f helmfileconfig/minikube/kano.yaml kano oci://harbor.portal.kalisio.com/kalisio/helm/kano
```
The default installation download all the devices from the internet. It's possible to skip this step:
```shell
helm install -f helmfileconfig/minikube/chirpstack.yaml  --set env.fetch_lorawan_device=False  chirpstack ./chirpstack-0.0.1.tgz
```

Uninstall with helm:
```shell
helm uninstall chirpstack
helm uninstall redis
helm uninstall postgres
helm uninstall mongodb
```

### basic usage

Connect to the network server on minikube:
```shell
minikube service chirpstack --url -n chirpstack-dev
```

### backup postgreSQL

Chirpstack store all its configuration (gateway, sensors, users) in a postgresql database.
If you need to reinstall the application or you delete the PVC, the database must be backup. 
Otherwise you will have to create again all the configuration.

Backup is done by running a `pg_dump` command in the container.
> [!WARNING]
> If you have imported the LoraWan devices, the dump could be nearly 50MB uncompressed.

The current archive is stored under `data/postgresql`.

```shell
cd data/postgresql
kubectl exec -it postgres-postgresql-0 -- sh
cd /bitnami/postgresql
pg_dump -U postgres -d chirpstack > dump.sql
# quit the shell
kubectl cp postgres-postgresql-0:/bitnami/postgresql/dump.sql .
```


Resore is done with psql command.
```shell
kubectl cp dump.sql postgres-postgresql-0:/bitnami/postgresql
kubectl exec -it postgres-postgresql-0 -- psql -U postgres -d chirpstack -f /bitnami/postgresql/dump.sql
# enter postgresql password...
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

This section describes how to connect a gateway and sensors to the chirpstack network, so you can view the data measured by your sensors. This part require the installation of a kubectl plugin, because kubectl cannot natively managed UDP port with kubectl port-forward (see issue #47862)[https://github.com/kubernetes/kubernetes/issues/47862].

The following hardware have been used for testing:

  * Gateway [Milesight UG63](https://www.milesight.com/iot/product/lorawan-gateway/ug63), the gateway support different packet forwared: MQTT, Semtech UDP, basicstation.
>  [!WARNING] 
>  MQTT packet forwarder required chirpstack V3
>  neither semtech UDP packet forwarder, neither MQTT packet forwarder support authentication

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
  2. Go to `Tenant > Devices Profiles`, create a profile for your sensor. Example milesight_environment.
  3. Go to `Tenant > Applications > Your application`, click on `Add device`
  4. The device EUI could be find on the the device
  5. it's not required to add Join EUI
  7. Select your device profile
  8. In the configuration tab, generate network session key and application key. Save
  9. Flash the device with NFC and configure Join type ABP and configure with the same keys entered in the portal
  10. Add a codec with javascript function. Milesight provide the javascript function for all the sensor on github [Milesight-IoT/SensorDecoders](https://github.com/Milesight-IoT/SensorDecoders).
  11. Once you have configure the codec, you can configure the measurement.

For each sensor, the codec must be configured to be able to view data. Data are visible in the metrics tab.

Known issues:

  * with OTAA authentication, if network server is rebooted, only the gate way is seen in the chirpstack IU. The sensor are not visible because the **join request** is not sent. Further investigation are required to say wether it come from the configuration of chirpstack or a bug in Chirpstack. Chirpstack may flush the key when stopping and not reinitiate a join on all sensors. For testing it's more convenient to have an ABP  authentication.



### Software tests


There is still open points on this section (test capabilities, payload data,)

  * [lora-pktgen](https://github.com/donadonny/lora-pktgen) : support only semtech (UDP packet) 
  * [LWN-simulator](https://github.com/UniCT-ARSLab/LWN-Simulator) : more complete system

## Roadmap

The project is currently a testbed. Below are a list of the future steps:

  - [x] testing with a hardware gateway  
  - [X] include an integration to mongoDB
  - [ ] integrate the Kalisio maps to view data
  - [ ] protect all services with a Keycloak webportal
