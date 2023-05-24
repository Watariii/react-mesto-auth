import success from "../../images/success.svg";
import failure from "../../images/failure.svg";
function InfoTooltip({ isOpen, onClose, regStatus }) {
  return (
    <section className={`pop-up ${isOpen ? "pop-up_opened" : ""}`}>
      <div className="pop-up__container">
        <button
          className="pop-up__close-icon"
          type="button"
          aria-label="закрыть"
          onClick={onClose}
        ></button>
        <img
          className="pop-up__status-icon"
          src={regStatus ? success : failure}
          alt="иконка статуса"
        />
        <h3 className="pop-up__title pop-up__title_type_info-tooltip">
          {regStatus
            ? "Вы успешно зарегистрировались!"
            : "Что то пошло не так! Попробуйте ещё раз."}
        </h3>
      </div>
    </section>
  );
}
export default InfoTooltip;
