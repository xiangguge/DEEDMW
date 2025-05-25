@echo off
setlocal enabledelayedexpansion

set total=0

:: 设置默认路径（如果参数为空）
set "src_path=%~1"
if "%src_path%"=="" set "src_path=./src"

:: 验证路径是否存在
if not exist "%src_path%\" (
    echo Error: Directory "%src_path%" does not exist.
    exit /b 1
)

:: 递归统计目标文件
for /r "%src_path%" %%f in (*.vue *.js *.css *.ts) do (
    for /f "tokens=3" %%a in ('find /c /v "" "%%f" 2^>nul') do (
        set /a total+=%%a
    )
)

:: 跨作用域传递变量值
endlocal & set "total=%total%"
echo Total lines of code: %total%