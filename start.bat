@ECHO OFF
TITLE AVITOBOT
setlocal ENABLEDELAYEDEXPANSION

DEL .env
TYPE > .env

ECHO Setup bot variables
ECHO DATABASE_PORT=5432>>.env
ECHO DATABASE_USER=root>>.env
ECHO DATABASE_PASSWORD=root>>.env
ECHO DATABASE=avito>>.env

FOR /f %%v IN (env-template.txt) do (
ECHO [%%v]
SET /p value=Enter value for %%v: && ECHO %%v=!value!>>.env
)

DEL bot/torrc
TYPE > bot/torrc

SET bridgetemplate=Bridge obfs4

FOR /f "delims=" %%v IN (torrc-template.txt) DO (
    ECHO "%%v %bridgetemplate%"
    IF /i "%%v" == "%bridgetemplate%" (
        SET /p userbridge="Enter bridge" && ECHO %%v !userbridge!>>bot/torrc
    ) else (
        ECHO %%v>>bot/torrc
    )
)

ECHO Is everything ok?
TYPE .env
PAUSE
ECHO " "
SET /p botname="Enter bot name" && docker compose -p !botname! up -d --build
PAUSE
DEL .env
