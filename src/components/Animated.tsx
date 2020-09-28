import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Animated = (Page: () => JSX.Element, key: string) => (props: any) => (
	<TransitionGroup
		appear={true}
	>
		<CSSTransition
			timeout={300}
			key={key}
			classNames="fade"
		>
			<Page {...props} />
		</CSSTransition>
	</TransitionGroup>
);

export default Animated;
