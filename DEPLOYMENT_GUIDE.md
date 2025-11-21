# 🚀 서버 배포 가이드 - Claude API 키 설정

이 문서는 GitLab CI/CD를 통해 서버에 배포할 때 Claude API 키를 사용하는 방법을 설명합니다.

## 📋 사전 준비사항

1. GitLab 프로젝트에 접근 권한
2. Claude API 키 (Anthropic에서 발급)
3. GitLab CI/CD Variables 설정 권한

---

## 🔧 단계별 설정 방법

### 1단계: GitLab CI/CD Variables 설정

#### 1-1. GitLab 프로젝트 접속
- GitLab 프로젝트 페이지로 이동
- 예: `https://gitlab.com/your-username/auction_project`

#### 1-2. CI/CD Variables 메뉴 접근
1. 좌측 메뉴에서 **Settings** 클릭
2. **CI/CD** 섹션 클릭
3. **Variables** 섹션에서 **Expand** 버튼 클릭

#### 1-3. API 키 변수 추가
**Add variable** 버튼 클릭 후 다음 정보 입력:

**첫 번째 변수:**
- **Key**: `VITE_ANTHROPIC_API_KEY`
- **Value**: 실제 Claude API 키 (예: `sk-ant-api03-...`)
- **Type**: `Variable`
- **Protect variable**: ✅ 체크 (master/main 브랜치에서만 사용)
- **Mask variable**: ✅ 체크 (로그에서 API 키 숨김)
- **Environment scope**: `All` (또는 특정 환경 선택)

**두 번째 변수 (선택사항):**
- **Key**: `VITE_ANTHROPIC_MODEL`
- **Value**: `claude-sonnet-4-5-20250929` (또는 사용할 모델)
- **Type**: `Variable`
- **Protect variable**: ✅ 체크
- **Mask variable**: ❌ 체크 안 함 (모델명은 민감정보 아님)
- **Environment scope**: `All`

#### 1-4. 저장
- **Add variable** 버튼 클릭하여 저장

---

### 2단계: 코드 확인

#### 2-1. 현재 설정 확인
다음 파일들이 올바르게 설정되어 있는지 확인:

**`.gitlab-ci.yml`** (이미 설정됨):
```yaml
--build-arg VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY} \
--build-arg VITE_ANTHROPIC_MODEL=${VITE_ANTHROPIC_MODEL} \
```

**`Dockerfile`** (이미 설정됨):
```dockerfile
ARG VITE_ANTHROPIC_API_KEY
ARG VITE_ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
ENV VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY}
ENV VITE_ANTHROPIC_MODEL=${VITE_ANTHROPIC_MODEL}
```

**`src/shared/api/claudeApi.ts`** (이미 설정됨):
```typescript
static API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
static MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
```

---

### 3단계: 배포 실행

#### 3-1. 코드 커밋 및 푸시
```bash
git add .
git commit -m "feat: Claude API 통합"
git push origin master
```

#### 3-2. GitLab CI/CD 파이프라인 확인
1. GitLab 프로젝트 페이지에서 **CI/CD** → **Pipelines** 클릭
2. 파이프라인 상태 확인:
   - 🟡 **Running**: 빌드 진행 중
   - 🟢 **Passed**: 빌드 성공
   - 🔴 **Failed**: 빌드 실패 (로그 확인 필요)

#### 3-3. 빌드 로그 확인
- 파이프라인 클릭 → **build-image** job 클릭
- 로그에서 다음 확인:
  - `--build-arg VITE_ANTHROPIC_API_KEY=***` (마스킹됨)
  - `✅ 이미지 빌드 완료`
  - `✅ 이미지 Push 완료!`

---

### 4단계: 배포 확인

#### 4-1. 서버 접속
- 배포된 서버 URL 접속 (예: `https://www.bdc105.kro.kr`)

#### 4-2. 기능 테스트
1. 경매 물건 검색
2. 물건 상세 페이지로 이동
3. **AI 분석 시작하기** 버튼 클릭
4. AI 분석 결과가 정상적으로 표시되는지 확인

#### 4-3. 에러 확인
만약 "AI 분석 실패" 메시지가 나타나면:
1. 브라우저 개발자 도구 (F12) → Console 탭 확인
2. 에러 메시지 확인:
   - `VITE_ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다`: GitLab Variables 미설정
   - `AI 분석 실패: ...`: API 키 오류 또는 네트워크 문제

---

## 🔍 문제 해결

### 문제 1: 빌드 시 API 키가 전달되지 않음

**증상:**
- 빌드 로그에 `VITE_ANTHROPIC_API_KEY`가 보이지 않음
- 런타임에 "환경 변수가 설정되지 않았습니다" 에러

**해결:**
1. GitLab Variables에 `VITE_ANTHROPIC_API_KEY`가 설정되어 있는지 확인
2. **Protect variable**이 체크되어 있으면, master/main 브랜치에서만 사용 가능
3. Variables의 **Environment scope**가 올바른지 확인

### 문제 2: API 키가 노출됨

**증상:**
- 빌드된 JavaScript 파일에서 API 키 확인 가능

**해결:**
- ⚠️ **정상 동작**: Vite는 빌드 시점에 환경 변수를 번들에 포함합니다
- 보안이 중요하면 백엔드 프록시 사용 권장

### 문제 3: 빌드는 성공했지만 런타임 에러

**증상:**
- 빌드는 성공했지만 서버에서 API 호출 실패

**해결:**
1. 브라우저 개발자 도구 → Network 탭에서 API 호출 확인
2. CORS 에러인지 확인
3. API 키가 올바른지 확인 (Anthropic 대시보드에서 확인)

---

## 🔐 보안 권장사항

### 현재 방식 (프론트엔드 직접 호출)
- ✅ 간단하고 빠름
- ❌ API 키가 브라우저에 노출됨
- ❌ 누구나 API 키를 복사해서 사용 가능

### 권장 방식 (백엔드 프록시)
- ✅ API 키가 서버에만 존재
- ✅ 브라우저에 노출되지 않음
- ✅ API 사용량 제어 가능
- ❌ 백엔드 개발 필요

**백엔드 프록시 구현 예시:**
```python
# 백엔드 (Python FastAPI 예시)
@app.post("/api/analyze")
async def analyze_auction(item_data: dict):
    # Claude API 호출 (서버에서만)
    response = anthropic_client.messages.create(...)
    return response
```

```typescript
// 프론트엔드
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify(itemData)
});
```

---

## 📝 체크리스트

배포 전 확인사항:

- [ ] GitLab CI/CD Variables에 `VITE_ANTHROPIC_API_KEY` 설정
- [ ] GitLab CI/CD Variables에 `VITE_ANTHROPIC_MODEL` 설정 (선택)
- [ ] `.gitignore`에 `.env` 파일 포함 확인
- [ ] 코드에 하드코딩된 API 키 없음 확인
- [ ] 로컬에서 `.env` 파일로 테스트 완료
- [ ] GitLab 파이프라인 빌드 성공 확인
- [ ] 서버에서 기능 테스트 완료

---

## 📞 추가 도움말

문제가 지속되면:
1. GitLab CI/CD 로그 확인
2. 브라우저 개발자 도구 Console/Network 탭 확인
3. Anthropic API 키 유효성 확인
4. 백엔드 프록시 방식 검토

