/* eslint-disable ts/no-empty-object-type */
import type { PublicProps } from 'vue'

export interface ComponentConstructor<Props = {}, Slots = {}> {
  new (): {
    $props: PublicProps & Props
    $slots: Slots
    $emit: (event: string, ...args: any[]) => void
  }
}
