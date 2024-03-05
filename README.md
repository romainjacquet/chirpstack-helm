# chirpstack-helm
Experimenting Chripstack deployment to Kubernetes.

## description

The region support is limited to Chirstack region used in Europe:

    * EU868     
    * IN865 
    * CN470 (soonly)
    * US915 (soonly)

## how to build

```shell
helm dependency build
helm package .
helm uninstall your-release
helm install ./chirpstack*tgz
```