#!/bin/bash

# This script is a legacy build interface. New consumers should
# instead use the node library interface exposed by buildlib.js.

node build.js >vivify.min.js && echo "vivify.min.js retrieved"