class Tools {
    static checkAddress(data, name, that) {
        const {firstValue, secondValue, thirdValue} = data;
        if (firstValue === '-1' || secondValue === '-1' || thirdValue === '-1') {
            const err = {};
            err[name] = {
                errors: [new Error('请选择正确的地区')],
            }
            that.props.form.setFields({...err});
        } else {
            const err = {};
            err[name] = {
                errors: null,
            }
            that.props.form.setFields({...err});
        }
    }
}

export default Tools;
