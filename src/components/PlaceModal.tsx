import { Marker } from "@/types/kakao.maps";
import { useEffect, useRef } from "react";
import { ExternalLink, XIcon } from "lucide-react";
import "@/styles/components/placemodal.css";

interface PlaceModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  modalContent: Marker | null;
}

const PlaceModal = ({
  isModalOpen,
  closeModal,
  modalContent,
}: PlaceModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen || !modalContent) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onClick={closeModal}
      aria-labelledby="modal"
    >
      <div
        ref={modalRef}
        className="modal-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {modalContent.title}
          </h3>
          <button
            title="닫기"
            ref={closeButtonRef}
            aria-label="모달 닫기"
            className="modal-close"
            onClick={closeModal}
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* content */}
        <div className="modal-content">
          <strong>주소</strong>
          <p>{modalContent.address}</p>
          <strong>정보</strong>
          <p>{modalContent.description}</p>
        </div>

        {/* footer */}
        <div className="modal-footer">
          <div className="flex flex-wrap gap-2 items-center">
            {modalContent.sns && (
              <a
                href={modalContent.sns}
                className="modal-content-link flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} />
                SNS
              </a>
            )}
            <a
              href={modalContent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-content-link ml-auto"
            >
              카카오맵에서 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceModal;
