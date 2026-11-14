import { DVonNeumann, DComplement, DFloat754, DAlu } from './d1'
import { DHierarchy, DCache, DAddressing } from './d2'
import { DDatapath, DPipeline, DRegisters, DSegment } from './d3'
import { DStack, DIoMethods, DInterrupt } from './d4'

const registry: Record<string, () => React.ReactElement> = {
  vonneumann: DVonNeumann,
  complement: DComplement,
  float754: DFloat754,
  alu: DAlu,
  hierarchy: DHierarchy,
  cache: DCache,
  addressing: DAddressing,
  datapath: DDatapath,
  pipeline: DPipeline,
  registers: DRegisters,
  segment: DSegment,
  stack: DStack,
  iomethods: DIoMethods,
  interrupt: DInterrupt,
}

export function Diagram({ id }: { id: string }) {
  const Cmp = registry[id]
  if (!Cmp) return null
  // 图解始终是「暖纸图版」：深浅两模式下都保持纸色卡片，保证配色语义稳定
  return (
    <figure className="my-6 rounded-xl border border-[#ddd5c4] bg-[#fbf9f4] p-4 sm:p-6">
      <Cmp />
    </figure>
  )
}
