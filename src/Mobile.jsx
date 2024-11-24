import React, {useState, useEffect} from 'react';
import {getRandomInt, generateExamples, generateMultiplicationExamples} from './math';
import './mobile.css';
function countResult(items) {
    return items.reduce((memo, item) => {
        return memo + (item.correct ? 1 : 0);
    }, 0);
}

function SmoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
        });
    }
}
export const Mobile = () => {
    const [amount, setAmount] = useState(30);
    const [limit, setLimit] = useState(12);
    const [examples, setExamples] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [type, setType] = useState('addition');
    useEffect(() => {
        const mobile_menu = document.querySelector('.mobile-menu');
        const mobile_trigger = document.querySelector('.mobile-menu__trigger');
        function handleMenuClick(event) {
            const target = event.target.closest('.mobile-menu__trigger');
            if (target && target == mobile_trigger) {
                mobile_menu.classList.toggle('mobile-menu_open');
            } else if (event.target !== mobile_trigger && event.target !== mobile_menu) {
                if (mobile_menu.classList.contains('mobile-menu_open')) {
                    mobile_menu.classList.remove('mobile-menu_open');
                }
            }
        }

        document.addEventListener('click', handleMenuClick);
        return () => {
            document.removeEventListener('click', handleMenuClick);
        };
    }, []);

    const startAddition = () => {
        const generatesExamples = generateExamples(amount, limit);
        setType('addition');
        setExamples(generatesExamples);
    };

    const startMultiplication = () => {
        const generatesExamples = generateMultiplicationExamples(amount, limit);
        setType('multiplication');
        setExamples(generatesExamples);
    };

    const moveToNextExample = (currentId) => {
        let nextId = Number(currentId) + 1;
        const element = document.querySelector(`section[data-id="${amount > nextId ? nextId : 0}"]`);
        const inputElement = document.querySelector(`input[data-id="${amount > nextId ? nextId : 0}"]`).focus();
        SmoothScrollTo(element);
    };

    const moveToSetup = (currentId) => {
        const element = document.querySelector(`section[id="${currentId}"]`);
        SmoothScrollTo(element);
    };

    const onBlur = (e) => {
        const value = e.target.value;
        const answer = Number(value);
        const id = e.target.dataset.id;
        const example = examples[id];
        const isCorrect = example.answer === answer;
        value === '' ? delete example.correct : (example.correct = isCorrect);
        const correct = countResult(examples);
        setExamples([...examples]);
        if (isCorrect) {
            setTimeout(() => {
                setCorrect(correct);
                moveToNextExample(id);
            }, 300);
        } else {
            setTimeout(() => {
                delete example.correct;
                setExamples([...examples]);
            }, 300);
        }
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            const id = e.target.dataset.id;
            const value = e.target.value;
            const answer = Number(value);
            const example = examples[id];
            const isCorrect = example.answer === answer;
            value === '' ? delete example.correct : (example.correct = isCorrect);
            const correct = countResult(examples);
            setExamples([...examples]);

            if (isCorrect) {
                setTimeout(() => {
                    setCorrect(correct);
                    moveToNextExample(id);
                }, 300);
            } else {
                setTimeout(() => {
                    delete example.correct;
                    setExamples([...examples]);
                }, 300);
            }
            e.preventDefault();
        }
    };

    const setup = () => {
        setExamples([]);
        setCorrect(0);
        moveToSetup(type);
    };

    const clear = () => {
        setExamples([]);
        setCorrect(0);
    };

    return (
        <div className="snappy-container">
            <nav className="mobile-menu">
                <a
                    href="#addition"
                    onClick={clear}
                >
                    New +/- training
                </a>
                <a
                    href="#multiplication"
                    onClick={clear}
                >
                    New multiplication training
                </a>
                <a
                    href="#about"
                    onClick={clear}
                >
                    About
                </a>
                <div className="mobile-menu__trigger">
                    <span></span>
                </div>
            </nav>
            <div className="overlay"></div>
            {examples.length > 0 && correct === examples.length && (
                <section className="congrats">
                    <div>
                        <h2>Congratulations!</h2>
                    </div>
                    <div>
                        <p>You solved all examples correctly!</p>
                    </div>
                    <div>
                        <button
                            className="next-button"
                            onClick={setup}
                        >
                            Back to lobby
                        </button>
                    </div>
                </section>
            )}
            {examples.length > 0 &&
                correct !== examples.length &&
                examples.map((item) => (
                    <section
                        className="equation-field"
                        key={item.id}
                        data-id={item.id}
                    >
                        <div>
                            <h2>
                                {item.id + 1}
                                {'. '}
                            </h2>
                            <h3>
                                Score {correct} / {examples.length}
                            </h3>
                        </div>
                        <div className="user-interaction">
                            <h2>{item.label}</h2>
                            <input
                                className={item.correct === undefined ? '' : item.correct === true ? 'correct' : 'incorrect'}
                                data-id={item.id}
                                type="number"
                                inputMode="numeric"
                                autoComplete="off"
                                disabled={item.correct === true}
                                onBlur={onBlur}
                                onKeyDown={onKeyDown}
                            />
                        </div>
                        <div>
                            <button
                                className="next-button"
                                data-id={item.id}
                                onClick={(e) => moveToNextExample(e.target.dataset.id)}
                            >
                                Next
                            </button>
                        </div>
                    </section>
                ))}
            {examples.length === 0 && (
                <>
                    <section
                        id="addition"
                        className="setup"
                    >
                        <div>
                            <h2>Number addition and subtraction</h2>
                            <h2>X + Y = Z</h2>
                            <h2>X - Y = Z</h2>
                        </div>
                        <div>
                            <label>How many to solve</label>
                            <input
                                className="setting"
                                type="number"
                                inputMode="numeric"
                                value={amount}
                                onChange={() => setAmount(Number(event.target.value))}
                            />
                            <label>Max equation result</label>
                            <input
                                className="setting"
                                type="number"
                                inputMode="numeric"
                                value={limit}
                                onChange={() => setLimit(Number(event.target.value))}
                            />
                        </div>
                        <div>
                            <button
                                className="next-button"
                                onClick={startAddition}
                            >
                                Start training
                            </button>
                        </div>
                    </section>
                    <section
                        id="multiplication"
                        className="setup"
                    >
                        <div>
                            <h2>Number multiplication</h2>
                            <h2>X x Y = Z</h2>
                        </div>
                        <div>
                            <label>How many to solve</label>
                            <input
                                className="setting"
                                type="number"
                                inputMode="numeric"
                                value={amount}
                                onChange={() => setAmount(Number(event.target.value))}
                            />
                            <label>Max multiplier</label>
                            <input
                                className="setting"
                                type="number"
                                inputMode="numeric"
                                value={limit}
                                onChange={() => setLimit(Number(event.target.value))}
                            />
                        </div>
                        <div>
                            <button
                                className="next-button"
                                onClick={startMultiplication}
                            >
                                Start training
                            </button>
                        </div>
                    </section>
                    <section id="about">
                        <p>This app is for training number addition, subtraction and multiplication for kids.</p>
                    </section>
                </>
            )}
        </div>
    );
};
