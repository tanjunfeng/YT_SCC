/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf,liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Row, Col, Upload, Icon, Modal, message } from 'antd';
import { withRouter } from 'react-router';
import reqwest from 'reqwest';
import Utils from '../../../../util/util';
import { promotionStatus } from '.././constants';
import { BranchCompany } from '../../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        branchCompanyId: '',
        isReleaseCouponModalVisible: false,
        grantMethod: 0,
        warehouseVisible: false,
        companyVisible: false,
        supplyChoose: {},
        isBtnDisabled: false,
        fileList: []
    }

    getStatus = () => {
        const keys = Object.keys(promotionStatus);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    getFormData = () => {
        const {
            franchiseeId,
            franchinessName,
            storeId,
            storeName,
            scPurchaseFlag,
            branchCompany
        } = this.props.form.getFieldsValue();
        let status = scPurchaseFlag;
        if (scPurchaseFlag === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            franchiseeId,
            franchinessName,
            storeId,
            storeName,
            scPurchaseFlag: status,
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch = () => {
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getFormData());
    }

    /**
     * 白名单下载导入模板
     */
    handleDownload = () => {
        // 将查询条件回传给调用页
        this.props.onDownloadList(this.getFormData());
    }

    /**
     * 白名单导出
     */
    handleExport = () => {
        // 将查询条件回传给调用页
        this.props.onExportList(this.getFormData());
    }

    handleReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onPromotionReset(); // 通知父页面已清空
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleGoOnline = () => {
        this.props.onModalClick();
    }

    handleOffline = () => {
        this.props.onModalOfflineClick();
    }

    /**
    *
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
            url: `${window.config.apiHost}sp/whiteListBatchImport`,
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                this.setState({
                    uploading: false,
                    isBtnDisabled: false
                });
                switch (res.code) {
                    case 200:
                        message.success('上传成功');
                        this.handleSearch();
                        break;
                    case 10004:
                        message.error(res.message);
                        break;
                    case 10024:
                        Modal.error({
                            title: '部分导入失败',
                            content: (
                                <div>
                                    {res.data.map(d => <p>{d.storeId} - {d.errorMsg}</p>)}
                                </div>
                            ),
                            onOk() { },
                        });
                        break;
                    default: break;
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { uploading } = this.state;
        const props = {
            name: 'file',
            action: `${window.config.apiHost}sp/whiteListBatchImport`,
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

        return (
            <div className="white-list-search-box">
                <Form>
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="加盟商编号" style={{ paddingRight: 10 }}>
                                {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="加盟商名称">
                                {getFieldDecorator('franchinessName')(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="所属子公司" className="LabelTop">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="门店编号" style={{ paddingRight: 10 }}>
                                {getFieldDecorator('storeId')(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="门店名称" style={{ paddingRight: 10 }}>
                                {getFieldDecorator('storeName')(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 状态 */}
                            <FormItem label="状态">
                                {getFieldDecorator('scPurchaseFlag', {
                                    initialValue: 'all'
                                })(
                                    <Select>
                                        {this.getStatus()}
                                    </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end">
                        <Col span={12} className="export-left">
                            <Upload {...props}>
                                <Button disabled={this.state.isBtnDisabled}>
                                    <Icon type="upload" /> {uploading ? '上传中' : '点击上传'}
                                </Button>
                            </Upload>
                            <Button type="primary" size="default" onClick={this.handleExport}>导出备份</Button>
                            <a onClick={this.handleDownload}>下载导入模板</a>
                        </Col>
                        <Col span={12} className="search-right">
                            <Button type="primary" size="default" onClick={this.handleSearch}>
                                查询
                            </Button>
                            <Button size="default" onClick={this.handleReset}>
                                重置
                            </Button>
                            <Button
                                type="primary"
                                size="default"
                                onClick={this.handleGoOnline}
                                disabled={this.props.value.selectListlength}
                            >
                                上线
                            </Button>
                            <Button
                                type="primary"
                                size="default"
                                onClick={this.handleOffline}
                                disabled={this.props.value.selectListlength}
                            >
                                下线
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    onModalClick: PropTypes.func,
    onModalOfflineClick: PropTypes.func,
    onExportList: PropTypes.func,
    downExportList: PropTypes.func,
    onDownloadList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(SearchForm));
