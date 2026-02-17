#!/bin/bash
# Update trek regions to provinces

# Santa Cruz (El Chaltén, Glaciar Perito Moreno)
npx sanity documents create --id trek-fitz-roy --replace --dataset production <<EOF
{"_type":"trek","_id":"trek-fitz-roy","region":{"_type":"reference","_ref":"region-santa-cruz"}}
EOF

# Voy a usar mutations en batch mejor
cat > /tmp/mutations.ndjson << 'MUTATIONS'
{"patch":{"id":"trek-fitz-roy","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-cerro-torre","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-huemul-circuit","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-perito-moreno","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-loma-pliegue","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-pn-perito-moreno","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-refugio-piedra-fraile","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-refugio-cagliero","set":{"region":{"_type":"reference","_ref":"region-santa-cruz"}}}}
{"patch":{"id":"trek-lago-puelo-cholila","set":{"region":{"_type":"reference","_ref":"region-chubut"}}}}
{"patch":{"id":"trek-5-lagunas","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugios-bariloche","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-cerro-tronador","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-cajon-azul","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-cerro-otto","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-cerro-campanario","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-cerro-llao-llao","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-frey","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-jakob","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-lopez","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-laguna-negra","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-otto-meiling","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-travesia-4-refugios","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-hielo-azul","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-natacion","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-piltriquitron","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-cerro-lindo","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-encanto-blanco","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-retamal","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-horqueta","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-los-laguitos","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-refugio-dedo-gordo","set":{"region":{"_type":"reference","_ref":"region-rio-negro"}}}}
{"patch":{"id":"trek-huella-andina-traful","set":{"region":{"_type":"reference","_ref":"region-neuquen"}}}}
{"patch":{"id":"trek-volcan-lanin","set":{"region":{"_type":"reference","_ref":"region-neuquen"}}}}
{"patch":{"id":"trek-refugio-lanin-caja","set":{"region":{"_type":"reference","_ref":"region-neuquen"}}}}
{"patch":{"id":"trek-aconcagua-francia","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-aconcagua-mulas","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-avion-uruguayos","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-cruce-andes-portillo","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-cerro-arco","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-plaza-mulas","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-confluencia-aconcagua","set":{"region":{"_type":"reference","_ref":"region-mendoza"}}}}
{"patch":{"id":"trek-hornocal","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-salinas-grandes","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-nevado-chani","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-volcan-tuzgle","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-tilcara-calilegua","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-siete-colores","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-ocloyas-maimara","set":{"region":{"_type":"reference","_ref":"region-jujuy"}}}}
{"patch":{"id":"trek-iruya-nazareno","set":{"region":{"_type":"reference","_ref":"region-salta"}}}}
{"patch":{"id":"trek-nubes","set":{"region":{"_type":"reference","_ref":"region-salta"}}}}
{"patch":{"id":"trek-san-bernardo","set":{"region":{"_type":"reference","_ref":"region-salta"}}}}
{"patch":{"id":"trek-jardin-republica","set":{"region":{"_type":"reference","_ref":"region-tucuman"}}}}
{"patch":{"id":"trek-ciudacita","set":{"region":{"_type":"reference","_ref":"region-tucuman"}}}}
{"patch":{"id":"trek-refugio-aconquija","set":{"region":{"_type":"reference","_ref":"region-tucuman"}}}}
{"patch":{"id":"trek-cruce-aconquija","set":{"region":{"_type":"reference","_ref":"region-catamarca"}}}}
{"patch":{"id":"trek-manchao","set":{"region":{"_type":"reference","_ref":"region-catamarca"}}}}
{"patch":{"id":"trek-champaqui","set":{"region":{"_type":"reference","_ref":"region-cordoba"}}}}
{"patch":{"id":"trek-condorito","set":{"region":{"_type":"reference","_ref":"region-cordoba"}}}}
{"patch":{"id":"trek-cerro-uritorco","set":{"region":{"_type":"reference","_ref":"region-cordoba"}}}}
{"patch":{"id":"trek-refugio-champaqui","set":{"region":{"_type":"reference","_ref":"region-cordoba"}}}}
{"patch":{"id":"trek-iguazu-superior","set":{"region":{"_type":"reference","_ref":"region-misiones"}}}}
{"patch":{"id":"trek-iguazu-inferior","set":{"region":{"_type":"reference","_ref":"region-misiones"}}}}
{"patch":{"id":"trek-macuco","set":{"region":{"_type":"reference","_ref":"region-misiones"}}}}
{"patch":{"id":"trek-w-torres","set":{"region":{"_type":"reference","_ref":"region-magallanes"}}}}
{"patch":{"id":"trek-o-torres","set":{"region":{"_type":"reference","_ref":"region-magallanes"}}}}
{"patch":{"id":"trek-base-torres","set":{"region":{"_type":"reference","_ref":"region-magallanes"}}}}
{"patch":{"id":"trek-cerro-castillo","set":{"region":{"_type":"reference","_ref":"region-aysen"}}}}
{"patch":{"id":"trek-queulat","set":{"region":{"_type":"reference","_ref":"region-aysen"}}}}
{"patch":{"id":"trek-exploradores","set":{"region":{"_type":"reference","_ref":"region-aysen"}}}}
{"patch":{"id":"trek-volcan-villarrica","set":{"region":{"_type":"reference","_ref":"region-araucania"}}}}
{"patch":{"id":"trek-conguillio","set":{"region":{"_type":"reference","_ref":"region-araucania"}}}}
{"patch":{"id":"trek-geiseres-tatio","set":{"region":{"_type":"reference","_ref":"region-antofagasta"}}}}
{"patch":{"id":"trek-valle-luna","set":{"region":{"_type":"reference","_ref":"region-antofagasta"}}}}
MUTATIONS

echo "Mutations file created at /tmp/mutations.ndjson"
