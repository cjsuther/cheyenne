#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-apps>"
    exit 1
fi

APPS_PATH=$1

apps=(
    "laramie-administracion-webapi"
	"laramie-administracion-async-service"
    "laramie-administracion-apigateway"
    "laramie-administracion-web"
	"laramie-auditoria-webapi"
    "laramie-comunicacion-webapi"
	"laramie-importacion-webapi"
    "laramie-ingresos-publicos-webapi"
    "laramie-ingresos-publicos-apigateway"
    "laramie-ingresos-publicos-web"
    "laramie-seguridad-webapi"
    "laramie-seguridad-apigateway"
    "laramie-seguridad-web"
	"laramie-tesoreria-webapi"
	"laramie-tesoreria-apigateway"
	"laramie-tesoreria-web"
	"laramie-wav-webapi"
)

SESSION_NAME="laramie-session"

tmux has-session -t $SESSION_NAME 2>/dev/null
if [ $? == 0 ]; then
    tmux kill-session -t $SESSION_NAME
fi

tmux new-session -d -s $SESSION_NAME

for app in "${apps[@]}"; do
    tmux new-window -t $SESSION_NAME -n $app

    if [[ $app == *"webapi"* || $app == *"apigateway"* ]]; then
        tmux send-keys -t $SESSION_NAME:$app "cd $APPS_PATH/$app && npm run dev" C-m
    elif [[ $app == *"web"* ]]; then
        tmux send-keys -t $SESSION_NAME:$app "cd $APPS_PATH/$app && npm start" C-m
    fi
done

tmux attach-session -t $SESSION_NAME
