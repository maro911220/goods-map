# 🗺️ 나의 홍대 굿즈샵

홍대 지역의 굿즈샵 정보를 카카오맵으로 확인할 수 있는 인터랙티브 웹 애플리케이션입니다 (진행중).

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Map API**: Kakao Maps SDK
- **Icons**: Lucide React

## 시작하기

1. **저장소 클론**

```bash
git clone https://github.com/maro911220/goods-map.git
cd goods-map
```

2. **의존성 설치**

```bash
npm install
# 또는
yarn install
```

3. **환경 변수 설정**

```bash
# .env.local 파일 생성 ( kakao developers 설정 필요 )
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_javascript_key
```

4. **개발 서버 실행**

```bash
npm run dev
# 또는
yarn dev
```

5. **브라우저에서 열기**

```
http://localhost:3000
```
