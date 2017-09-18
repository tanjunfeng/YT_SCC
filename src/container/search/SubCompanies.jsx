/**
 * 查询可选子公司值清单
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form } from 'antd';
import { pubFetchValueList } from '../../actions/pub';
import SearchMind from '../../components/searchMind';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList,
}, dispatch))

class SubCompanies extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSubCompanyClear = this.handleSubCompanyClear.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.searchMind = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.branchCompanyId === '') {
            this.searchMind = null;
        }
    }

    /**
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.searchMind.reset();
        this.props.onSubCompaniesClear();
    }

    /**
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.props.onSubCompaniesChooesd(record.id);
    }

    render() {
        return (
            <FormItem>
                <div className="row">
                    <span className="sc-form-item-label search-mind-label">所属公司</span>
                    <SearchMind
                        compKey="spId"
                        ref={ref => { this.searchMind = ref }}
                        fetch={(params) =>
                            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
                            this.props.pubFetchValueList({
                                branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                                branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : ''
                            }, 'findCompanyBaseInfo')
                        }
                        onChoosed={this.handleSubCompanyChoose}
                        onClear={this.handleSubCompanyClear}
                        renderChoosedInputRaw={(row) => (
                            <div>{row.id} - {row.name}</div>
                        )}
                        pageSize={6}
                        columns={[
                            {
                                title: '子公司id',
                                dataIndex: 'id',
                                width: 98
                            }, {
                                title: '子公司名字',
                                dataIndex: 'name'
                            }
                        ]}
                    />
                </div>
            </FormItem>
        );
    }
}

SubCompanies.propTypes = {
    pubFetchValueList: PropTypes.func,
    onSubCompaniesChooesd: PropTypes.func,
    onSubCompaniesClear: PropTypes.func,
    branchCompanyId: PropTypes.string
}

export default withRouter(Form.create()(SubCompanies));
