#!/bin/bash

rm -rf chrome
mkdir chrome
cp manifest.json chrome
cp style.css chrome
cp *.js chrome
cp -r icons chrome
cd chrome && zip -r ../dist.zip ./*

