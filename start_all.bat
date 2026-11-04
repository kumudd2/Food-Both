@echo off

REM -------------------------------------------------
REM FoodBooth – start script
REM -------------------------------------------------

echo Starting backend...
pushd d:\new\server
if not exist node_modules (
  echo Installing backend dependencies...
  npm install
)
start cmd /k "npm run dev"
popd

echo Starting frontend...
pushd d:\new\client
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
)
start cmd /k "npm run dev"
popd

exit
