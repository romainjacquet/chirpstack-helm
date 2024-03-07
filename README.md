# chirpstack-helm

Experimenting Chirpstack deployment to Kubernetes. The goal is testing a private LoraWan network for smart agriculture.
This private network will allow all the participants to share data, and view on a map.

The region support is limited to Chirstack region used in Europe:

  * EU868     
  * IN865 
  * CN470 (soonly)
  * US915 (soonly)

## basic installation guide

Install the dependency, redis with default password and suitable configuration for Chirpstack:

``shell
helm install --set auth.password='TheRedisPwd!' --set master.extraFlags='{--save,300,1,--save,60,100,--appendonly,no}' b-redis oci://registry-1.docker.io/bitnamicharts/redis
helm install --set auth.postgresPassword='Root' \
  --set auth.username='chirpstack' \
  --set auth.password='chirpstack' \
  --set auth.database='chirpstack' \
  --set primary.initdb.scripts.'001-chirpstack_extensions\.sql=
        create extension pg_trgm;
        create extension hstore;
    ' \
  b-postgres \
  oci://registry-1.docker.io/bitnamicharts/postgresql
```

Build and install instructions:

```shell
helm dependency build
helm package .
helm uninstall <your-release>
helm install --set env.redis_host=b-redis-master --set env.redis_password=VGhlUmVkaXNQd2Qh  --set env.postgres_host=b-postgres-postgresql  <your-release> ./chirpstack*tgz
```

The choosen infrastructure has one MQTT broker per region. The advantages are:

  * better scalability (avoid that one MQTT broker support all the regions traffic)
  * easyier configuration on user side (no need to add a prefix in the topic)

![Chripstack](/schemas/infra-structure.png)

The external services are :

    * the web portal for the network server Chirpstack (port 80)
    * MQTT forwarder port 1883
    * UDP semtech port 1700
    * basic station 3001 (to be confirmed)

Authent

## Use cases 

  * adding a new user, i.e. new gateway in a region 
  * deleting a user

## Tests

Tests should be done both with software (simulators) and hardare.
Type of devices to test ?

### Hardware tests

We need at least a gateway and typical sensors for smart agriculture. Money can be saved by buying just a temperature sensor.

  * [a GW for 200€](https://sparwan.com/smart-office-/115-passerelle-lorawan-ug63-868m-6974225038176.html), support all the connexion we need: MQTT, Semtech, BS
  * [a weather station 300€](https://sparwan.com/stations-meteo/642-station-meteo-lorawan-8-en-1-sensecap-s2120-seeedstudio.html)
  * [a soil humidity captor, 200€](https://sparwan.com/smart-agriculture-/495-capteur-d-humidite-du-sol-lorawan-rak-wireless-c15007.html)
  * [a simple temperature sensor](https://sparwan.com/qualite-de-l-air/599-capteur-de-temperature-lorawan-milesight-ts302.html)

### Software tests


There is still open points on this section (test capabilities, payload data,)

  * [lora-pktgen](https://github.com/donadonny/lora-pktgen) : support only semtech (UDP packet) 
  * [LWN-simulator](https://github.com/UniCT-ARSLab/LWN-Simulator) : more complete system
  * 
