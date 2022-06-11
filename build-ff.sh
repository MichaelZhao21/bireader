#!/bin/bash

./firefox.sh
cd firefox/ && zip -r ../dist.zip ./*
