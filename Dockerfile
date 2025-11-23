# ============================================
# Stage 1: Build (Node.js 빌드 환경)
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# BuildKit 캐시 마운트로 npm 의존성 캐싱
# package.json만 먼저 복사 (레이어 캐싱 최적화)
COPY package*.json ./

# 의존성 설치 (BuildKit 캐시 활용)
#RUN --mount=type=cache,target=/root/.npm \
#    npm ci --prefer-offline --no-audit

# 의존성 설치
# 참고: K8s Runner는 Pod가 삭제되므로 --mount=type=cache는 효과 없음
# 대신 --cache-from으로 Harbor 이미지 캐시 사용
RUN npm ci --prefer-offline --no-audit

# 소스 코드 복사
COPY . .

# 빌드 시 환경 변수 주입 (ARG로 받아서 ENV로 설정)
ARG VITE_GEMINI_API_KEY
ARG VITE_GEMINI_MODEL=gemini-2.0-flash
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
ENV VITE_GEMINI_MODEL=${VITE_GEMINI_MODEL}

# 빌드 실행
RUN npm run build

# 불필요한 devDependencies 제거
RUN npm prune --production

# ============================================
# Stage 2: Production (최종 실행 환경)
# ============================================
FROM node:22-alpine

WORKDIR /app

# wget 설치 (헬스체크용)
RUN apk add --no-cache wget curl

# 보안: non-root 사용자로 실행
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# serve 전역 설치
RUN npm install -g serve

# 빌드된 파일만 복사 (builder stage에서)
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# 메타데이터 (빌드 정보)
ARG CI_COMMIT_SHA
ARG CI_COMMIT_SHORT_SHA
LABEL org.opencontainers.image.revision="${CI_COMMIT_SHA}" \
      org.opencontainers.image.created="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# non-root 사용자로 전환
USER nodejs

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# 실행 명령
CMD ["serve", "-s", "dist", "-p", "3000", "-n"]
