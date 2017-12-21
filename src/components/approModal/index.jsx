import { withRouter } from 'react-router';
import {Form} from 'antd';
import ApproModal from './App'

export default withRouter(Form.create()(ApproModal));
