import {remote} from 'electron';
import React from 'react';
import bip39 from 'bip39';
import View from '../components/View';
import {sharedLoginContainer} from '../containers/Login';
import CreatePortfolioStep1 from './CreatePortfolioStep1';
import CreatePortfolioStep2 from './CreatePortfolioStep2';
import CreatePortfolioStep3 from './CreatePortfolioStep3';
import CreatePortfolioStep4 from './CreatePortfolioStep4';
import './CreatePortfolio.scss';

const {createPortfolio} = remote.require('./portfolio-util');

class CreatePortfolio extends React.Component {
	state = {
		portfolioName: '',
		portfolioPassword: '',
		confirmedPassword: '',
		confirmedPasswordError: null,
		generatedSeedPhrase: '',
		confirmedSeedPhrase: '',
		seedPhraseError: null,
	};

	generateSeedPhrase = () => {
		this.setState({generatedSeedPhrase: bip39.generateMnemonic()});
	};

	setConfirmPasswordInput = input => {
		this.confirmPasswordInput = input;
	};

	handlePortfolioNameInputChange = value => {
		this.setState({portfolioName: value});
	};

	handlePortfolioPasswordInputChange = value => {
		this.setState({portfolioPassword: value});
	};

	handleConfirmPasswordInputChange = value => {
		this.setState({confirmedPassword: value});
	};

	handleStep1Submit = async event => {
		event.preventDefault();

		if (this.state.portfolioPassword !== this.state.confirmedPassword) {
			this.setState({
				confirmedPassword: '',
				confirmedPasswordError: 'Confirmed password doesn\'t match password',
			});
			this.confirmPasswordInput.focus();
			return;
		}

		this.setState({confirmedPasswordError: null});

		sharedLoginContainer.setActiveView('CreatePortfolioStep2');
		sharedLoginContainer.setProgress(0.50);
	};

	handleStep2ClickNext = () => {
		sharedLoginContainer.setActiveView('CreatePortfolioStep3');
		sharedLoginContainer.setProgress(0.75);
	};

	checkSeedPhrase = () => {
		const isMatch = this.state.generatedSeedPhrase === this.state.confirmedSeedPhrase;
		const seedPhraseError = isMatch ? null : 'The seed phrase you entered is not the same as the generated one';
		this.setState({seedPhraseError});
		return isMatch;
	};

	setConfirmSeedPhraseTextArea = textarea => {
		this.confirmSeedPhraseTextArea = textarea;
	}

	handleConfirmSeedPhraseInputChange = value => {
		this.setState({confirmedSeedPhrase: value}, () => {
			if (this.step3confirmButtonClicked) {
				this.checkSeedPhrase();
			}
		});
	};

	handleStep3Submit = async event => {
		event.preventDefault();

		this.step3confirmButtonClicked = true;

		if (!this.checkSeedPhrase()) {
			this.confirmSeedPhraseTextArea.focus();
			return;
		}

		const portfolioId = await createPortfolio({
			name: this.state.portfolioName,
			password: this.state.portfolioPassword,
			seedPhrase: this.state.generatedSeedPhrase,
		});

		sharedLoginContainer.setActiveView('CreatePortfolioStep4');
		sharedLoginContainer.setProgress(1);

		await sharedLoginContainer.loadPortfolios();
		await sharedLoginContainer.handleLogin(portfolioId, this.state.portfolioPassword);

		// TODO: Need a progress indicator here as login takes a while
	};

	componentWillMount() {
		this.generateSeedPhrase();
		sharedLoginContainer.setActiveView('CreatePortfolioStep1');
	}

	render() {
		const activeView = sharedLoginContainer.state.activeView;

		// TODO: Clean this up
		return (
			<React.Fragment>
				<View
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep1}
					setConfirmPasswordInput={this.setConfirmPasswordInput}
					handlePortfolioNameInputChange={this.handlePortfolioNameInputChange}
					handlePortfolioPasswordInputChange={this.handlePortfolioPasswordInputChange}
					handleConfirmPasswordInputChange={this.handleConfirmPasswordInputChange}
					handleStep1Submit={this.handleStep1Submit}
				/>
				<View
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep2}
					generateSeedPhrase={this.generateSeedPhrase}
					handleStep2ClickNext={this.handleStep2ClickNext}
				/>
				<View
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep3}
					setConfirmSeedPhraseTextArea={this.setConfirmSeedPhraseTextArea}
					handleConfirmSeedPhraseInputChange={this.handleConfirmSeedPhraseInputChange}
					handleStep3Submit={this.handleStep3Submit}
				/>
				<View
					activeView={activeView}
					component={CreatePortfolioStep4}
				/>
			</React.Fragment>
		);
	}
}

export default CreatePortfolio;
