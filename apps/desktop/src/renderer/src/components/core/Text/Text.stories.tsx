import type { Meta, StoryObj } from '@storybook/react';

import Text from './Text';

const meta: Meta<typeof Text> = {
  component: Text,
  title: 'Core/Text',
  tags: ['autodocs'],
  args: { children: 'Reliability means the system continues to work correctly.', variant: 'body' },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Heading: Story = { args: { variant: 'heading', children: 'Welcome back, Serhat' } };
export const Title: Story = { args: { variant: 'title', children: 'Sources' } };
export const Subtitle: Story = { args: { variant: 'subtitle', children: 'Thinking in Systems' } };
export const Body: Story = {};
export const BodyBold: Story = { args: { variant: 'bodyBold', children: 'Highlight saved' } };
export const BodySub: Story = { args: { variant: 'bodySub', color: 'textSecondary' } };
export const Caption: Story = {
  args: { variant: 'caption', color: 'textTertiary', children: 'Captured 4 Sep, 8:41 pm' },
};
export const Label: Story = {
  args: { variant: 'label', color: 'textTertiary', children: 'Today' },
};
export const Mono: Story = {
  args: {
    variant: 'mono',
    color: 'textTertiary',
    children: '/Users/serhat/Books/thinking-in-systems.pdf',
  },
};
export const Clamped: Story = {
  args: {
    numberOfLines: 2,
    style: { maxWidth: 280 },
    children:
      'A system is a set of things interconnected in such a way that they produce their own pattern of behavior over time. The system may be buffeted, constricted, triggered, or driven by outside forces.',
  },
};
export const Error: Story = {
  args: {
    variant: 'caption',
    color: 'statusErrorPrimary',
    children: 'Email or password is incorrect.',
  },
};
