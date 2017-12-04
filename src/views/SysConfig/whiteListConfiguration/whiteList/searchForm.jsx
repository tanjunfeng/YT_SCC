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
        visibleUpload: false,
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
    * 上传文件模态框显示隐藏
    */
    showModalUpload = () => {
        this.setState({
            visibleUpload: true,
        });
    }

    hideModalUpload = () => {
        this.props.form.resetFields()
        this.versionExplain = ''
        this.setState({
            visibleUpload: false,
            fileList: [],
            uploading: false
        })
    }

    /**
    *
    * 上传
    */
    handleUpload = () => {
        const { fileList } = this.state;
        if (fileList[0].name.indexOf('.xlsx') === -1) {
            message.error('上传文件格式必须为03版以后的excel（*.xlsx）格式，请清除后重新尝试');
        }
        const formData = new FormData();
        formData.append('file', fileList[0]);
        this.setState({
            uploading: true,
        });
        reqwest({
            url: `${window.config.apiHost}sp/whiteListBatchImport`,
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                if (res.code === 200) {
                    message.success('上传成功');
                    this.handleSearch()
                    this.hideModalUpload()
                } else {
                    this.setState({
                        uploading: false
                    });
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { uploading } = this.state;
        const props = {
            action: `${window.config.apiHost}sp/whiteListBatchImport`,
            onRemove: () => {
                this.setState({
                    fileList: []
                });
            },
            beforeUpload: (file) => {
                this.setState({
                    fileList: [file]
                });
                return false;
            },
            fileList: this.state.fileList
        };

        return (
            <div className="search-box white-list">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="加盟商编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商名称">
                                    {getFieldDecorator('franchinessName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="所属子公司">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="门店编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="门店名称" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    {getFieldDecorator('scPurchaseFlag', {
                                        initialValue: 'all'
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getStatus()}
                                        </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col span={8} className="export-left">
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.showModalUpload}>导入</Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleExport}>导出备份</Button>
                                </FormItem>
                            </Col>
                            <Col span={16} className="search-right">
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleSearch}>
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleReset}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        size="default"
                                        onClick={this.handleGoOnline}
                                        disabled={this.props.value.selectListlength}
                                    >
                                        上线
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        size="default"
                                        onClick={this.handleOffline}
                                        disabled={this.props.value.selectListlength}
                                    >
                                        下线
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <Modal
                    title="模板导入"
                    visible={this.state.visibleUpload}
                    onCancel={this.hideModalUpload}
                    footer={null}
                >
                    <div>
                        <Upload {...props}>
                            <Button disabled={this.state.fileList.length > 0}>
                                <Icon type="upload" /> 选择文件
                            </Button>
                        </Upload>
                        <Button
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.fileList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? '上传中' : '点击上传'}
                        </Button>
                    </div>
                </Modal>
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
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(SearchForm));
