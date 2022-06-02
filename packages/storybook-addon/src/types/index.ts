import type { ComponentProps, JSXElementConstructor } from 'react';
import type { ComponentStory } from '@storybook/react';

type ReactComponentProps = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
interface ApolloStoryParameters<TProviderProps extends ReactComponentProps> {
  apolloClient: Omit<ComponentProps<TProviderProps>, 'children'>;
}

export interface StoryWithApollo<
  TProviderProps extends ReactComponentProps,
  TComponentProps extends ReactComponentProps = any
> extends ComponentStory<TComponentProps> {
  parameters?: ApolloStoryParameters<TProviderProps>;
}
