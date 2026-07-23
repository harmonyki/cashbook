@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo    가계부 수정사항 업로드 + 자동 배포
echo ============================================
echo.
set /p msg="무엇을 바꿨나요? (그냥 엔터해도 됩니다): "
if "%msg%"=="" set msg=update

echo.
echo [1/3] 변경사항 저장 중...
git add -A
git commit -m "%msg%"

echo.
echo [2/3] GitHub에 업로드 중...
git push
if errorlevel 1 (
  echo.
  echo *** 업로드 실패. 인터넷 연결이나 로그인 상태를 확인하세요. ***
  echo.
  pause
  exit /b 1
)

echo.
echo [3/3] 완료!
echo.
echo GitHub에 올라갔고, Vercel이 자동으로 배포를 시작합니다.
echo 1~2분 뒤 아래 주소에서 확인하세요:
echo.
echo     https://cashbook-amber.vercel.app
echo.
echo 배포 진행 상황: https://vercel.com/harmonyki/cashbook
echo.
pause
