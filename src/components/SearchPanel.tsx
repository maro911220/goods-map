import { useState, useMemo } from "react";
import { Marker } from "@/types/kakao.maps";
import { useKakaoMap } from "@/hooks/useKakaoMap";
import "@/styles/components/searchpanel.css";

interface SearchPanelProps {
  onMarkerClick: (marker: Marker) => void;
  selectedMarker?: Marker | null;
  markers: Marker[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  onMarkerClick,
  selectedMarker,
  markers,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 로직
  const filteredMarkers = useMemo(() => {
    if (!searchTerm.trim()) return markers;
    const lowerSearch = searchTerm.toLowerCase();
    return markers.filter(
      (marker) =>
        marker.title.toLowerCase().includes(lowerSearch) ||
        marker.address.toLowerCase().includes(lowerSearch)
    );
  }, [markers, searchTerm]);

  return (
    <section className="panel">
      <h2 className="hidden">검색창</h2>
      {/* 검색 입력창 */}
      <div className="mb-3">
        <input
          type="text"
          aria-label="장소 검색"
          className="panel-input"
          placeholder="장소 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 검색 결과 표시 */}
      {filteredMarkers.length === 0 ? (
        <p className="panel-no-results">검색 결과가 없습니다</p>
      ) : (
        <ul className="panel-list">
          {filteredMarkers.map((marker) => {
            const isSelected = selectedMarker?.title === marker.title;

            return (
              <li
                key={`${marker.title}-${marker.lat}-${marker.lng}`}
                role="button"
                tabIndex={0}
                aria-label={`${marker.title} 선택`}
                className={`panel-list-item ${isSelected ? "active" : ""}`}
                onClick={() => onMarkerClick(marker)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onMarkerClick(marker);
                  }
                }}
              >
                <div className="panel-list-item__title">{marker.title}</div>
                <div className="panel-list-item__address">{marker.address}</div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 하단 */}
      <div className="panel-footer">
        <p>나의 홍대 굿즈샵</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="panel-footer-link"
          href="https://github.com/maro911220"
        >
          maro
        </a>
      </div>
    </section>
  );
};

export default SearchPanel;
