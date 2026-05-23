import { Signal } from '@angular/core';
import { GraphSelectionType } from '@enums/chart-typology.enum';
import { GraphView, SelectOption } from '@interfaces/graph-config.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { AcademicYear } from '../years';

export function GraphResolvers(
  infoCds: CdsService['getInfoCds'],
  infoTeaching: ReturnType<TeachingService['getTeachingGraph']>,
  graphService?: GraphService,
): Record<GraphSelectionType, () => GraphView | null> {
  return {
    cds_general: (): GraphView | null => {
      const data = infoCds.value();
      return data ? GraphMapper.toCdsGeneralGraph(data.courses) : null;
    },
    teaching_cds: (): GraphView | null => {
      const data = infoTeaching.value();
      return data ? GraphMapper.toTeachingGraph(data) : null;
    },
    cds_year: (): GraphView | null => {
      const data = infoCds.value();
      const year = graphService?.selectedYear();
      if (!data || !year) return null;

      const search = graphService!.teachingSearch().trim().toUpperCase();
      const vIndex = graphService!.selectedVIndex();

      const yearTeachings = data.teachingsByYear[year] ?? [];
      const teachings = yearTeachings
        .filter((t) => t.schedeopis?.domande != null)
        .filter((t) => !search || t.nome.toUpperCase().includes(search))
        .sort((a, b) => {
          if (a.anno !== b.anno) return a.anno < b.anno ? -1 : 1;
          return a.nome.localeCompare(b.nome);
        });

      if (!teachings.length) return null;

      const schede = teachings.map((t) => t.schedeopis);
      const [, valuesPerV] = graphService!.elaborateFormulaFor(schede);
      const values = valuesPerV[vIndex] ?? [];
      const cdsMean = data.courses[year]?.[0]?.[vIndex] ?? null;

      return GraphMapper.toAcademicYearGraph(teachings, values, cdsMean, vIndex);
    },
    cds_boxplot: () => {
      const data = infoCds.value();
      const year = graphService?.selectedYear();
      if (!data || !year) return null;

      const yearTeachings = data.teachingsByYear[year] ?? [];
      const teachings = yearTeachings.filter((t) => t.schedeopis?.domande != null);
      if (!teachings.length) return null;

      const schede = teachings.map((t) => t.schedeopis);
      const [, valuesPerV] = graphService!.elaborateFormulaFor(schede);

      return GraphMapper.toBoxplotGraph(valuesPerV);
    },
  };
}

export function SelectorResolvers(
  infoCds: CdsService['getInfoCds'],
  availableYears: Signal<AcademicYear[]>,
): Record<Exclude<GraphSelectionType, 'cds_general'>, () => SelectOption[]> {
  const yearOptions = () => availableYears().map((y) => ({ value: y, label: y })).reverse();

  return {
    teaching_cds: () =>
      infoCds.value()?.teachings.map((t) => ({
        value: t.id,
        label: t.canale === 'no' ? t.nome : `${t.nome} (${t.canale})`,
      })) ?? [],
    cds_year: yearOptions,
    cds_boxplot: yearOptions,
  };
}
