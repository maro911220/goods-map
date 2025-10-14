import { forwardRef } from "react";

const KakaoMap = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} className="w-full h-full" id="kakao-map" />;
});

KakaoMap.displayName = "KakaoMap";

export default KakaoMap;
