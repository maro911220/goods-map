import { forwardRef } from "react";

const KakaoMap = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section className="w-full h-full">
      <h2 className="hidden">카카오 지도</h2>
      <div ref={ref} className="w-full h-full" id="kakao-map" />
    </section>
  );
});

KakaoMap.displayName = "KakaoMap";

export default KakaoMap;
