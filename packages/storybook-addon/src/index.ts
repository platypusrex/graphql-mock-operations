/* eslint-disable import/no-import-module-exports */
import { ComponentProps, JSXElementConstructor } from 'react';
import { ComponentStory } from '@storybook/react';

type AnyObject<T = unknown> = Record<string, T>;

type ReactComponentProps = JSXElementConstructor<AnyObject> | keyof JSX.IntrinsicElements;
interface ApolloStoryParameters<TProviderProps extends ReactComponentProps> {
  apolloClient: Omit<ComponentProps<TProviderProps>, 'children'>;
}

export interface StoryWithApollo<
  TProviderProps extends ReactComponentProps,
  TComponentProps extends ReactComponentProps = any
> extends ComponentStory<TComponentProps> {
  parameters?: ApolloStoryParameters<TProviderProps>;
}

if (module?.hot?.decline) {
  module.hot.decline();
}
