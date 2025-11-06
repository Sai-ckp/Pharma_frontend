import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {h1registerentries} from './h1registerentries';

const meta: Meta<typeof h1registerentries> = {
  component: h1registerentries,
};

export default meta;

type Story = StoryObj<typeof h1registerentries>;

export const Basic: Story = {args: {}};
