/**
 * 售价导入 - 查询条件
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Select, Row, Col, Input, DatePicker, Upload, Icon, message } from 'antd';
import { withRouter } from 'react-router';
import reqwest from 'reqwest';
import Util from '../../../util/util';
import { priceResult } from './constants';
import { BranchCompany, Commodity } from '../../../container/search';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isBtnDisabled: false,
            uploading: false,
            fileList: []
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.selectMap = this.selectMap.bind(this);
    }

    /**
     * 获取表单数据
     */
    getFormData() {
        const {
            importsId,
            company,
            product,
            pariceDateRange,
            handleResult
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            importsId,
            branchCompanyId: company.id,
            productId: product.record ? product.record.productId : '',
            uploadStartDate: pariceDateRange.length > 1 ? pariceDateRange[0].valueOf() : '',
            uploadEndDate: pariceDateRange.length > 1 ? pariceDateRange[1].valueOf() : '',
            handleResult
        });
    }

    /**
     * 点击搜索的回调
     */
    handleSearch() {
        // 通知父页面执行搜索
        this.props.handlePurchaseSearch(this.getFormData());
    }

    /**
     * 点击重置的回调
     */
    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.handlePurchaseReset(); // 通知查询条件已清除
        this.props.isCreateChange(''); // 通知父组件禁用创建变价单按钮
    }

    /**
     * 遍历select框选项
     */
    selectMap() {
        return priceResult.data.map(item => (
            <Option key={item.key} value={item.key}>
                {item.value}
            </Option>))
    }

    /**
    * 上传
    */
    handleUpload = (fileList) => {
        this.setState({
            isBtnDisabled: true,
            uploading: true
        })
        const fileName = fileList[0].name;
        if (fileName.indexOf('.xls') === -1) {
            message.error('上传文件格式必须为excel格式，请重新尝试');
            this.setState({
                uploading: false,
                isBtnDisabled: false
            });
            return;
        }
        const formData = new FormData();
        formData.append('file', fileList[0]);
        reqwest({
            url: `${window.config.apiHost}prodSell/sellPriceChangeUpload`,
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                this.setState({
                    uploading: false,
                    isBtnDisabled: false
                });
                if (res.code === 200) {
                    message.success('上传成功');
                    this.props.form.setFieldsValue({ importsId: res.data })
                    this.props.isCreateChange(res.data)
                    this.handleSearch();
                } else {
                    message.error(res.message);
                }
            },
            error: () => {
                this.setState({
                    uploading: false
                });
                message.error('服务异常，请重新尝试');
            },
        });
    }

    /**
     * 下载模板
     */
    handleDownload = () => {
        this.props.exportTemplate();
    }

    /**
     * 下载导入结果
     */
    handleExport = () => {
        this.props.exportList();
    }

    /**
     * 创建变价单
     */
    handleCreateChange = () => {
        this.props.getCreateChange();
    }

    /**
     * 判断创建变价单按钮是否可用
     * @param {object} e 事件对象
     */
    ImportsIdChange = (e) => {
        const value = e.target.value
        this.props.isCreateChange(value)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const props = {
            name: 'file',
            action: `${window.config.apiHost}prodSell/sellPriceChangeUpload`,
            onRemove: () => {
                this.setState({
                    fileList: [],
                    isBtnDisabled: false
                });
            },
            beforeUpload: (file) => {
                const fileList = [file]
                this.setState({
                    fileList
                });
                this.handleUpload(fileList)
                return false;
            },
            fileList: this.state.fileList
        };
        const { uploading, isBtnDisabled } = this.state;
        return (
            <Form layout="inline" className="price-import">
                <Row className="row-bottom">
                    <Col>
                        <FormItem label="上传ID">
                            {getFieldDecorator('importsId')(
                                <Input size="default" placeholder="请输入上传ID" onChange={this.ImportsIdChange} />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="子公司">
                            {getFieldDecorator('company', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="商品">
                            {getFieldDecorator('product', {
                                initialValue: { productId: '', productName: '' }
                            })(<Commodity api="queryProductForSelect" />)
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="上传日期">
                            {getFieldDecorator('pariceDateRange', {
                                initialValue: []
                            })(<RangePicker
                                size="default"
                                className="manage-form-enterTime"
                                showTime={{ format: MINUTE_FORMAT }}
                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                placeholder={['开始时间', '结束时间']}
                            />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="处理结果">
                            {getFieldDecorator('handleResult', { initialValue: priceResult.defaultValue })(
                                <Select size="default" onChange={this.statusChange}>
                                    {this.selectMap()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col className="price-import-btn">
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>

                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>

                        <a onClick={this.handleDownload}>下载导入模板</a>

                        <Upload {...props}>
                            <Button disabled={isBtnDisabled}>
                                <Icon type="upload" /> {uploading ? '上传中' : '点击上传'}
                            </Button>
                        </Upload>

                        <Button size="default" onClick={this.handleExport} disabled={this.props.exportBtnDisabled}>
                            下载导入结果
                        </Button>

                        <Button size="default" onClick={this.handleCreateChange} disabled={this.props.changeBtnDisabled}>
                            创建变价单
                        </Button>
                    </Col>
                </Row>
            </Form >
        );
    }
}

SearchForm.propTypes = {
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    exportList: PropTypes.func,
    exportTemplate: PropTypes.func,
    getCreateChange: PropTypes.func,
    isCreateChange: PropTypes.func,
    exportBtnDisabled: PropTypes.bool,
    changeBtnDisabled: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(SearchForm));
