const Spinner = ({showText = true, text = 'Loading', style = {}, parentClassName = '', size = 'sm'}) => {
    return (
        <div className={`d-flex justify-content-center align-items-center ${parentClassName}`}>
            <div class="d-flex justify-content-center" style={{...style}}>
                <div class={`spinner-border spinner-${size}`} role="status" />
            </div>
            {showText && <p className={`text_loading-${size}`}>{text}</p>}
        </div>
    );
};

export default Spinner;