#!/bin/bash

rm -rf chrome
mkdir chrome
cp manifest.json chrome
cp *.js chrome
cp -r icons chrome
zip dist.zip chrome/*
