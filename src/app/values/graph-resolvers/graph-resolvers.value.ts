import { Signal } from '@angular/core';
import { GraphSelectionType } from '@enums/chart-typology.enum';
import { GraphView, SelectOption } from '@interfaces/graph-config.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { CdsService } from '@services/cds/cds.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { AcademicYear } from '../years';

export function GraphResolvers(
  infoCds: CdsService['getInfoCds'],
  infoTeaching: ReturnType<TeachingService['getTeachingGraph']>,
): Record<GraphSelectionType, () => GraphView | null> {
  return {
    cds_general: () => {
      const data = infoCds.value();
      return data ? GraphMapper.toCdsGeneralGraph(data.coarse) : null;
    },
    teaching_cds: () => {
      const data = infoTeaching.value();
      return data ? GraphMapper.toTeachingGraph(data) : null;
    },
    cds_year: () => {
      throw new Error('Function not implemented.');
    },
  };
}

export function SelectorResolvers(
  infoCds: CdsService['getInfoCds'],
  availableYears: Signal<AcademicYear[]>,
): Record<Exclude<GraphSelectionType, 'cds_general'>, () => SelectOption[]> {
  return {
    teaching_cds: () =>
      infoCds.value()?.teachings.map((t) => ({
        value: t.id,
        label: t.nome + ` (Canale ${t.canale})`,
      })) ?? [],
    cds_year: () => availableYears().map((y) => ({ value: y, label: y })),
  };
}
