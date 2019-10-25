# abaco

Sistema Ábaco.

## Introdução

Chart para o sistema Ábaco Basis.

##NECESSÁRIO PATCH:
`kubectl patch --namespace abaco-tst --type=json service es-abaco-discovery -p='[{"op": "add", "path": "/spec/publishNotReadyAddresses", "value": true}]'`