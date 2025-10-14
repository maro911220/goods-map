import { useState, useMemo } from "react";
import { Marker } from "@/types/kakao.maps";
import "@/styles/components/categoryfilter.css";

interface CategoryFilterProps {
  markers: Marker[];
  onFilterChange: (filteredMarkers: Marker[]) => void;
}

export default function CategoryFilter({
  markers,
  onFilterChange,
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 마커 카테고리 체크 함수
  const doesMarkerMatch = (marker: Marker, selection: string[]) => {
    return marker.category.some((cat) => selection.includes(cat));
  };

  // 카테고리 목록 생성
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    markers.forEach((marker) => {
      marker.category.forEach((category) => {
        categorySet.add(category);
      });
    });
    return Array.from(categorySet).sort();
  }, [markers]);

  // 카테고리 선택/해제
  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    const filtered =
      newSelected.length === 0
        ? markers
        : markers.filter((marker) => doesMarkerMatch(marker, newSelected));

    setSelectedCategories(newSelected);
    onFilterChange(filtered);
  };

  // 전체 선택/해제
  const toggleAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
      onFilterChange(markers);
    } else {
      setSelectedCategories(categories);
      onFilterChange(
        markers.filter((marker) => doesMarkerMatch(marker, categories))
      );
    }
  };

  return (
    <div className="category">
      <button onClick={() => setIsOpen(!isOpen)} className="category-btn">
        <span>카테고리</span>
        {selectedCategories.length > 0 && (
          <span className="text-xs text-rose-500">
            ( {selectedCategories.map((item) => item).join(",")} )
          </span>
        )}
      </button>

      {isOpen && (
        <div className="category-box">
          <div className="category-box-header">
            <p>카테고리 선택</p>
            <button onClick={toggleAll}>
              {selectedCategories.length === categories.length
                ? "전체 해제"
                : "전체 선택"}
            </button>
          </div>

          <div className="category-box-list">
            {categories.map((category) => (
              <label key={category} className="category-box-item">
                <input
                  type="checkbox"
                  onChange={() => toggleCategory(category)}
                  checked={selectedCategories.includes(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
