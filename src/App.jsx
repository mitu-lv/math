import React, {useState} from 'react';
import {getRandomInt, generateExamples} from './math';

function countResult(items) {
    return items.reduce((memo, item) => {
        return memo + (item.correct ? 1 : 0);
    }, 0);
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        const amount = 30;
        const limit = 20;
        this.state = {
            amount,
            limit,
            items: generateExamples(amount, limit),
            correct: 0,
        };
        this.onBlur = this._onBlur.bind(this);
        this.onChangeAmount = this._onChangeAmount.bind(this);
        this.onChangeLimit = this._onChangeLimit.bind(this);
        this.onKeyDown = this._onKeyDown.bind(this);
    }

    _onKeyDown(e) {
        if (e.keyCode === 13) {
            let nextId = Number(e.target.dataset.id) + 1;
            document.querySelector(`input[data-id="${this.state.amount > nextId ? nextId : 0}"]`).focus();
            e.preventDefault();
        }
    }

    _onChangeAmount(e) {
        const value = e.target.value;
        const amount = Number(value);
        this.setState({
            amount,
            correct: 0,
            items: generateExamples(amount, this.state.limit),
        });
    }

    _onChangeLimit(e) {
        const value = e.target.value;
        const limit = Number(value);
        this.setState({
            limit,
            correct: 0,
            items: generateExamples(this.state.amount, limit),
        });
    }

    _onBlur(e) {
        const value = e.target.value;
        const answer = Number(value);
        const id = e.target.dataset.id;
        const items = this.state.items;
        const item = items[id];
        value === '' ? delete item.correct : (item.correct = item.answer === answer);
        const correct = countResult(items);
        this.setState({items, correct});
    }

    render() {
        return (
            <div>
                <div className="results">
                    Amount of examples:{' '}
                    <input
                        className="setting"
                        type="text"
                        value={this.state.amount}
                        onChange={this.onChangeAmount}
                    />
                    Maximum of addition:{' '}
                    <input
                        className="setting"
                        type="text"
                        value={this.state.limit}
                        onChange={this.onChangeLimit}
                    />
                </div>
                <ol className="equations">
                    {this.state.items.map((item) => (
                        <li
                            className="equation-field"
                            key={item.id}
                        >
                            <span className="equation">{item.label}</span>
                            <span className="sign">{'='}</span>
                            <input
                                className={item.correct === undefined ? '' : item.correct === true ? 'correct' : 'incorrect'}
                                data-id={item.id}
                                type="text"
                                onChange={this.onBlur}
                                onKeyDown={this.onKeyDown}
                            />
                        </li>
                    ))}
                </ol>
                <div className="results">
                    {this.state.correct} / {this.state.amount}
                </div>
            </div>
        );
    }
}
