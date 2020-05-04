MAIN

#1. Project Information
Site_Name="Celda de barros"
Location="Buenos Aires"
Completed_by="Pablo Depetris; Luciano Medrano"
Date=2015-05-12
Work_name="Caso RBCA"

#2.Which Type of RBCA Analysis?
Type=2		#1: Tier 1 (Risk-Based Screening Levels)
		#2: Tier 2/3 (Site-Specific Target Levels)

#3.Calculation Options
(afecta que inputs son pedidos)

Baseline-risks=T	#t/f  (Forward mode)
RBCA_Cleanup_lvls=t	#t/f  (Backward mode)


Risl_Goals=2		#1:Individual Constituents Risk Goals Only
			#2:Individual & Cumulative Risk Goals

Apply_Depletion=F		#t/f (Apply source depletion algorithm)
time_to_future_exposure=NA	#tiempo de integracion [años]




#4. RBCA PROCESS:


##4.1 Prepare Input Data
(Secciones)
	- Exposure Pathways
	- COCs
	- Transport Models
	- Soil Parameters
	- GW Parameters
	- Air Parameters

##4.2 Review Output
(Secciones)
	- Exposure Flowchart
	- COC Chem Parameters
	- Input Data Summary
	- User-Spec. COC Data
	- Transient Domenico Analysis
	- Baseline Risks..
	- Cleanup Levels

##5. Commands and Options











=============================================================
Exposure PathWay Identification:

#1. GW Exposure
	
	# pathways: (residential, commercial, user-defined, Maximum Contaminante Level (MCL)=water drinking criterion)
On_site_pathway=None	
Off_site1_pathway=Residential
Off_site2_pathway=S.W		#ademas inclye S.W (surface water)

On_site_dist=0.0		#[m]
Off_site1_dist=45		#distancia de la fuente [m]
Off_site2_dist=5000		#distancia de la fuente [m]

##Source Media:
Affected_GW=T				#t/f
Affected_Soils_Leaching_to_GW=F		#t/f
## Option
Apply_MCL_value_as_ingestion_REBEL=T	#t/f (backgward mode only)

##GW discharge to Surface Water Exposure:
gw_discharge_2_SW_exposure=1,2	#1:Swimming
				#2:Fish Conumption
				#3:Specified Water Quality Criteria
wq_criteria=NA		#valor de WQCriteria (solo si gw_disc..=3)



#2.Surface Soil Exposure
On_site_pathway=None

##Source Media
direct_ingestion=F		#t/f
dermal_contact=F		#t/f
inhalation=F			#t/f
vegetable_ingestion=F		#t/f
construction_worker=F		#t/f


#3.Air Exposure

''' volatilization & particulates to outdoor air inhalation

on_site_pathway=None
off_site1_pathway=None
off_site2_pathway=None

on_site_dist=0
off_site1_dist=45
off_site2_dist=5000



##Source Media
	affected_gw=F
	affected_soils_volati=F
	affected_soils_partic=F


''' volatil to indoor air inhalation '''
on_site_pathway=None
off_site1_pathway=None
off_site2_pathway=None
on_site_dist=0
off_site1_dist=45
off_site2_dist=5000

##Source Media
	affected_soils=F			#t/f
	affected_soils_leaching_to_gw=F		#t/f
	affected_gw=F				#t/f


#4. Commands & Options
	- go to Main
	- print Sheet
	- Set Units
	- Help
	- Exposure Factors & Target Risks
	- Exposure Flowchart



==============================================================
COCs

COC_id=
COC_name=
COC_concentration_gw=
COC_concentration_soil
COC_mole_frac_in_source_material=


apply_raoults_law=	#t/f




================================================================
Transport Model Options


