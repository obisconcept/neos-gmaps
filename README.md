# neos-gmaps
A Neos CMS package to add Google Maps as node

## Installation
Add the package in your site package composer.json

```
"require": {
  "obisconcept/neos-gmaps": "~2.0.0"
}
```

## Requirements
The package requires jQuery which is not provided within.

## Usage
Add your API key to the `Settings.yaml` of your site package

```
ObisConcept:
  NeosGmaps:
    apiKey: '...'
```
