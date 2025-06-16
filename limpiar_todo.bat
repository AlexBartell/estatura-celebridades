@echo off
echo 🔥 Limpiando proyecto Next.js a fondo...

REM Borra directorios y archivos que suelen quedar con tipos cacheados o builds corruptos
IF EXIST node_modules rmdir /s /q node_modules
IF EXIST .next rmdir /s /q .next
IF EXIST out rmdir /s /q out
IF EXIST dist rmdir /s /q dist
IF EXIST build rmdir /s /q build
IF EXIST types rmdir /s /q types
IF EXIST package-lock.json del /f /q package-lock.json
IF EXIST yarn.lock del /f /q yarn.lock

REM Borra todos los archivos .ts y .d.ts que pueda haber en .next/types (¡por si no se borra el dir completo!)
IF EXIST ".next\types" (
  del /s /q ".next\types\*"
  rmdir /s /q ".next\types"
)

REM Fuerza limpieza en VSCode (si usas)
IF EXIST ".vscode\settings.json" (
  echo Puedes reiniciar VSCode después para liberar caché de editor.
)

echo 🟢 Listo. Ahora ejecuta:
echo     npm install
echo     npm run build
echo Y revisa el error (si aún sale, reinicia la PC, vuelve a instalar y prueba de nuevo).
pause