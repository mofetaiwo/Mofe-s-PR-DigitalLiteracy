import React from 'react';
import '../Layouts/Main/FAQ/FAQ.css';

const faqItems = [
	'I got a new computer, so what do I do now?',
	'What kind of computer am I using?',
	'What are the icons I see when I look at my phone?',
	'How can I get my emails on my phone?',
	'What is the difference between all the mail apps?',
	'Can I get my school emails on my personal account?',
	'What are these errors my computer keeps getting?',
	'How do I right-click?',
	'How do I drag and drop?',
	'What is a trackpad?',
	'What is a browser/search engine?',
	'What is the difference between a browser and app?',
	'What is Canvas?',
	"How do I 'search' the web?",
	'How do I customize my settings app?',
	'What is cache & cookies?',
	'How do I go back to the previous page?',
	'How do I get to my student email?',
	"How do I know I'm using the right email account?",
	"Where do I find my professor's contact info?",
];

export default function FAQ() {

	return (
		<div className="faq-container">
			<header>
				<h1>Frequently Asked Questions</h1>
				<a>
					Got a question? We’re here to answer. If you don’t see your question below, ask it here:{' '}
					<a className="ask-question" href="#">
						ask a question
					</a>
				</a>
			</header>
			<div className="search-bar">
				<input type="text" placeholder="Search Questions" />
			</div>
			<ul className="faq-list">
				{faqItems.map((item, index) => (
					<li key={index} className="faq-item">
						<span>{item}</span>
						<span>&gt;</span>
					</li>
				))}
			</ul>
		</div>
	);
}
